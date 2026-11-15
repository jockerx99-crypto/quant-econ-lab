#!/usr/bin/env python3
"""
Générateur de données pour le Chapitre 4 : Séries Temporelles Macro & ALM (Gestion Actif-Passif)
Données temporelles pour Window Functions SQL (LAG, LEAD) et économétrie des séries temporelles (ADF, VaR, OLS dynamique).
"""
import os
import numpy as np
import pandas as pd

def generate_ch4_data(n_quarters=60, random_state=999):
    np.random.seed(random_state)
    
    # Création des dates trimestrielles de 2010 à 2024
    dates = pd.date_range(start='2010-01-01', periods=n_quarters, freq='QE')
    periodes = [f"{d.year}-Q{(d.month-1)//3 + 1}" for d in dates]
    
    # Trajectoire de taux Euribor 3M (processus autorégressif AR(1) avec changement de régime)
    euribor = np.zeros(n_quarters)
    euribor[0] = 0.70
    for t in range(1, n_quarters):
        # Choc négatif post-2014, hausse post-2022
        drift = -0.04 if t < 48 else 0.25
        euribor[t] = 0.90 * euribor[t-1] + drift + np.random.normal(0, 0.20)
    euribor = np.clip(euribor, -0.60, 4.20).round(3)
    
    # Inflation HICP annuelle (%)
    inflation = np.zeros(n_quarters)
    inflation[0] = 1.6
    for t in range(1, n_quarters):
        mean_target = 1.8 if t < 46 else 6.5
        inflation[t] = 0.75 * inflation[t-1] + 0.25 * mean_target + np.random.normal(0, 0.35)
    inflation = inflation.round(2)
    
    # Rendement souverain OAT 10 ans (%) = Taux neutre + prime de terme + sensibilité Euribor/Inflation
    terme_premium = np.random.normal(0.60, 0.15, size=n_quarters)
    oat_10y = (0.65 * euribor + 0.22 * inflation + terme_premium + np.random.normal(0, 0.10)).round(3)
    
    # Spread de crédit obligations corporate BBB (bps)
    spread_bbb = (140 - 15 * euribor + 10 * np.maximum(0, inflation - 2.5) + np.random.normal(0, 15, size=n_quarters)).round(1)
    
    # Rendement indiciel actions (%)
    rendement_actions = np.random.normal(1.8, 5.2, size=n_quarters).round(2)
    # Crash 2020 Q1
    if n_quarters > 40:
        rendement_actions[40] = -24.8
        rendement_actions[41] = 14.5
        
    df = pd.DataFrame({
        'periode': periodes,
        'date': dates.strftime('%Y-%m-%d'),
        'euribor_3m': euribor,
        'oat_10y': oat_10y,
        'inflation_hicp': inflation,
        'spread_corp_bbb': spread_bbb,
        'rendement_actions_pct': rendement_actions
    })
    
    # Deux valeurs manquantes en fin de série pour forcer la gestion temporelle
    df.loc[12, 'spread_corp_bbb'] = np.nan
    df.loc[35, 'inflation_hicp'] = np.nan
    
    return df

if __name__ == '__main__':
    target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public', 'data'))
    os.makedirs(target_dir, exist_ok=True)
    df = generate_ch4_data()
    output_path = os.path.join(target_dir, 'ch4_macro_alm_taux.csv')
    df.to_csv(output_path, index=False)
    print(f"Dataset Ch4 généré avec succès : {output_path} ({len(df)} lignes)")
