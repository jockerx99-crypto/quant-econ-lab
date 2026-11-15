/* eslint-disable no-restricted-globals */
// Pyodide Web Worker for QuantEcon Lab
// Runs completely isolated from the UI main thread

let pyodide = null;
let isReady = false;
let isInitializing = false;

// Redirection and helper script injected into Python namespace
const PYTHON_INIT_SCRIPT = `
import sys
import io
import base64
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Clean light theme for plots matching Notion / Stripe aesthetic
plt.style.use('default')
plt.rcParams['figure.facecolor'] = '#ffffff'
plt.rcParams['axes.facecolor'] = '#fafaf9'
plt.rcParams['axes.edgecolor'] = '#e7e5e4'
plt.rcParams['axes.labelcolor'] = '#292524'
plt.rcParams['xtick.color'] = '#78716c'
plt.rcParams['ytick.color'] = '#78716c'
plt.rcParams['grid.color'] = '#f5f5f4'
plt.rcParams['font.size'] = 9.5
plt.rcParams['lines.linewidth'] = 2

def _capture_plots():
    plots = []
    for num in plt.get_fignums():
        fig = plt.figure(num)
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight', dpi=140, facecolor='#ffffff', edgecolor='none')
        buf.seek(0)
        encoded = base64.b64encode(buf.read()).decode('utf-8')
        plots.append(f"data:image/png;base64,{encoded}")
    plt.close('all')
    return plots
`;

async function initPyodideWorker() {
  if (isReady || isInitializing) return;
  isInitializing = true;

  try {
    self.postMessage({ type: 'STATUS', status: 'loading_wasm', message: 'Chargement du runtime Pyodide (WASM)...' });
    
    // Load Pyodide from CDN
    self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');

    // @ts-ignore
    pyodide = await self.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
    });

    self.postMessage({ type: 'STATUS', status: 'loading_packages', message: 'Chargement des bibliothèques économétriques (NumPy, Pandas, Statsmodels, Matplotlib)...' });

    // Load core analytical packages
    await pyodide.loadPackage(['numpy', 'pandas', 'scipy', 'matplotlib', 'statsmodels']);

    // Initialize python helper
    await pyodide.runPythonAsync(PYTHON_INIT_SCRIPT);

    isReady = true;
    isInitializing = false;
    self.postMessage({ type: 'READY' });
  } catch (err) {
    isInitializing = false;
    self.postMessage({ type: 'ERROR', error: err.message || String(err) });
  }
}

async function runPythonCode(id, code, contextData = null) {
  if (!isReady || !pyodide) {
    self.postMessage({ id, type: 'ERROR', error: "L'environnement Pyodide n'est pas encore prêt." });
    return;
  }

  try {
    // If context datasets need to be injected
    if (contextData) {
      if (contextData.csv && contextData.varName) {
        pyodide.globals.set('__csv_temp__', contextData.csv);
        await pyodide.runPythonAsync(`
import io
import pandas as pd
${contextData.varName} = pd.read_csv(io.StringIO(__csv_temp__))
del __csv_temp__
        `);
      }
    }

    // Intercept stdout / stderr
    await pyodide.runPythonAsync(`
__stdout_buf__ = io.StringIO()
__stderr_buf__ = io.StringIO()
sys.stdout = __stdout_buf__
sys.stderr = __stderr_buf__
`);

    let executionError = null;
    let evalResult = null;

    try {
      evalResult = await pyodide.runPythonAsync(code);
    } catch (execErr) {
      executionError = execErr.message || String(execErr);
    }

    // Retrieve stdout, stderr and plot images
    const outputData = await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__

_out = __stdout_buf__.getvalue()
_err = __stderr_buf__.getvalue()
_plots = _capture_plots()

import json
json.dumps({
    "stdout": _out,
    "stderr": _err,
    "plots": _plots
})
`);

    const parsedOutput = JSON.parse(outputData);

    let formattedResult = null;
    if (evalResult !== undefined && evalResult !== null) {
      try {
        if (typeof evalResult.toJs === 'function') {
          formattedResult = evalResult.toJs();
        } else {
          formattedResult = String(evalResult);
        }
      } catch {
        formattedResult = String(evalResult);
      }
    }

    self.postMessage({
      id,
      type: 'RUN_RESULT',
      success: !executionError,
      stdout: parsedOutput.stdout,
      stderr: executionError ? (parsedOutput.stderr ? parsedOutput.stderr + "\n" + executionError : executionError) : parsedOutput.stderr,
      plots: parsedOutput.plots || [],
      result: formattedResult
    });
  } catch (err) {
    self.postMessage({
      id,
      type: 'ERROR',
      error: err.message || String(err)
    });
  }
}

async function validateExercise(id, testCode) {
  if (!isReady || !pyodide) {
    self.postMessage({ id, type: 'VALIDATE_RESULT', passed: false, message: "Pyodide n'est pas prêt." });
    return;
  }

  try {
    pyodide.globals.set('__validation_passed__', false);
    pyodide.globals.set('__validation_msg__', '');

    await pyodide.runPythonAsync(`
try:
${testCode.split('\n').map(line => '    ' + line).join('\n')}
    __validation_passed__ = True
    __validation_msg__ = "Félicitations ! Tous les tests économétriques sont validés."
except AssertionError as ae:
    __validation_passed__ = False
    __validation_msg__ = f"Assertion non validée : {str(ae) if str(ae) else 'Résultat inattendu.'}"
except Exception as e:
    __validation_passed__ = False
    __validation_msg__ = f"Erreur durant les tests : {str(e)}"
`);

    const passed = pyodide.globals.get('__validation_passed__');
    const message = pyodide.globals.get('__validation_msg__');

    self.postMessage({
      id,
      type: 'VALIDATE_RESULT',
      passed: Boolean(passed),
      message: String(message)
    });
  } catch (err) {
    self.postMessage({
      id,
      type: 'VALIDATE_RESULT',
      passed: false,
      message: err.message || String(err)
    });
  }
}

async function seedDataset(varName, csv) {
  if (!isReady || !pyodide) return;
  try {
    pyodide.globals.set('__csv_temp__', csv);
    await pyodide.runPythonAsync(`
import io
import pandas as pd
${varName} = pd.read_csv(io.StringIO(__csv_temp__))
del __csv_temp__
`);
  } catch (err) {
    console.warn('[Pyodide Worker] Silent seed error:', err);
  }
}

self.onmessage = async function(event) {
  const { action, id, code, contextData, testCode, varName, csv } = event.data;

  switch (action) {
    case 'INIT':
      await initPyodideWorker();
      break;
    case 'SEED':
      await seedDataset(varName, csv);
      break;
    case 'RUN':
      await runPythonCode(id, code, contextData);
      break;
    case 'VALIDATE':
      await validateExercise(id, testCode);
      break;
    default:
      console.warn('[Pyodide Worker] Unknown action:', action);
  }
};
