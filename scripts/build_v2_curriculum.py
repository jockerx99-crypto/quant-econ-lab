#!/usr/bin/env python3
"""
Assemble Version 2 modules and write src/data/courses_v2.ts
"""

import sys
import os
import json

# Ensure scripts directory is on sys.path
sys.path.insert(0, '/Users/lucaspasqualis/quant-econ-lab')

from scripts.v2_modules.module1_sql import MODULE_1
from scripts.v2_modules.module2_matrix_econometrics import MODULE_2
from scripts.v2_modules.module3_monte_carlo import MODULE_3

def format_ts_template(text: str) -> str:
    # 1. Backslashes doubled so \mu becomes \\mu in TS source
    t = text.replace('\\', '\\\\')
    # 2. Backticks escaped
    t = t.replace('`', '\\`')
    # 3. Interpolation escaped
    t = t.replace('${', '\\${')
    return t

def generate_courses_v2_ts():
    modules = [MODULE_1, MODULE_2, MODULE_3]
    
    out = []
    out.append('import { CourseModule } from "@/types/course";\n')
    out.append('export const COURSE_MODULES_V2: CourseModule[] = [')
    
    for mod in modules:
        out.append('  {')
        out.append(f'    id: {json.dumps(mod["id"], ensure_ascii=False)},')
        out.append(f'    title: {json.dumps(mod["title"], ensure_ascii=False)},')
        out.append(f'    subtitle: {json.dumps(mod["subtitle"], ensure_ascii=False)},')
        out.append(f'    icon: {json.dumps(mod["icon"], ensure_ascii=False)},')
        out.append(f'    description: {json.dumps(mod["description"], ensure_ascii=False)},')
        out.append('    exercises: [')
        
        for ex in mod['exercises']:
            out.append('      {')
            out.append(f'        id: {json.dumps(ex["id"], ensure_ascii=False)},')
            out.append(f'        title: {json.dumps(ex["title"], ensure_ascii=False)},')
            out.append(f'        category: {json.dumps(ex["category"], ensure_ascii=False)},')
            out.append(f'        language: {json.dumps(ex["language"], ensure_ascii=False)},')
            out.append(f'        difficulty: {json.dumps(ex["difficulty"], ensure_ascii=False)},')
            out.append(f'        durationMinutes: {ex["durationMinutes"]},')
            out.append(f'        description: {json.dumps(ex["description"], ensure_ascii=False)},')
            
            # Template literal for theoryMarkdown
            formatted_theory = format_ts_template(ex["theoryMarkdown"].strip())
            out.append(f'        theoryMarkdown: `\n{formatted_theory}\n        `,')
            
            out.append(f'        taskMarkdown: {json.dumps(ex["taskMarkdown"], ensure_ascii=False)},')
            out.append(f'        initialCode: {json.dumps(ex["initialCode"], ensure_ascii=False)},')
            out.append(f'        solutionCode: {json.dumps(ex["solutionCode"], ensure_ascii=False)},')
            
            if "validationQuery" in ex:
                out.append(f'        validationQuery: {json.dumps(ex["validationQuery"], ensure_ascii=False)},')
            if "testPythonCode" in ex:
                out.append(f'        testPythonCode: {json.dumps(ex["testPythonCode"], ensure_ascii=False)},')
                
            out.append(f'        hints: {json.dumps(ex["hints"], ensure_ascii=False)},')
            out.append('        datasets: []')
            out.append('      },')
            
        out.append('    ]')
        out.append('  },')
        
    out.append('];\n')
    
    target_path = '/Users/lucaspasqualis/quant-econ-lab/src/data/courses_v2.ts'
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))
        
    total_exercises = sum(len(m['exercises']) for m in modules)
    print(f"Successfully generated {len(modules)} modules and {total_exercises} exercises in {target_path}!")

if __name__ == '__main__':
    generate_courses_v2_ts()
