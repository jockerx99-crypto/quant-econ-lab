#!/usr/bin/env python3
"""
Générateur de données pour le Chapitre 3 : Modèle Linéaire & Économétrie du Risque de Crédit / ALM
Deux tables reliées : 'emprunteurs' et 'marche_credit' pour pratiquer JOINs et régressions OLS Statsmodels.
"""
import os
import numpy as np
import pandas as pd

def generate_ch3_data(n_samples=400, random_state=42):
    np.random.seed(random_state)
    
    client_ids = [f"EMP-{i:05d}" for i in range(1, n_samples + 1)]
    secteurs = np.random.choice(['Industrie', 'Services', 'Technologie', 'BTP', 'Commerce'], size=n_samples, p=[0.25, 0.30, 0.15, 0.15, 0.15])
    
    # Variables explicatives économiques
    chiffre_affaires_m = np.random.lognormal(mean=2.5, sigma=0.8, size=n_samples).round(2)
    ratio_endettement = np.random.uniform(0.15, 0.95, size=n_samples).round(3)
    score_credit = (850 - ratio_endettement * 300 + np.log(chiffre_affaires_m + 1) * 30 + np.random.normal(0, 30, size=n_samples)).clip(300, 850).round(1)
    
    # Taux directeur Euribor associé au contrat
    euribor = np.random.choice([-0.25, 0.50, 1.50, 2.75, 3.50], size=n_samples)
    
    # Vraie relation linéaire économétrique pour le spread de crédit (en bps) :
    # spread = 120 + 0.85 * (1000 - score) + 210 * ratio_endettement - 15 * log(CA) + bruit
    bruit = np.random.normal(0, 25, size=n_samples)
    spread_credit_bps = (
        120 
        + 0.85 * (850 - score_credit) 
        + 210 * ratio_endettement 
        - 15 * np.log(chiffre_affaires_m + 1)
        + 40 * (euribor > 2.0).astype(int)
        + bruit
    ).round(2)
    
    # Taux d'intérêt final du prêt (%) = Euribor + Spread / 100
    taux_pret_pct = (euribor + spread_credit_bps / 100.0).round(2)
    
    df = pd.DataFrame({
        'client_id': client_ids,
        'secteur': secteurs,
        'chiffre_affaires_m': chiffre_affaires_m,
        'ratio_endettement': ratio_endettement,
        'score_credit': score_credit,
        'euribor_ref': euribor,
        'spread_credit_bps': spread_credit_bps,
        'taux_pret_pct': taux_pret_pct
    })
    
    # Présence de quelques valeurs nulles
    null_idx = np.random.choice(n_samples, size=12, replace=False)
    df.loc[null_idx[:6], 'score_credit'] = np.nan
    df.loc[null_idx[6:], 'ratio_endettement'] = np.nan
    
    return df

if __name__ == '__main__':
    target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public', 'data'))
    os.makedirs(target_dir, exist_ok=True)
    df = generate_ch3_data()
    output_path = os.path.join(target_dir, 'ch3_tarification_credits.csv')
    df.to_csv(output_path, index=False)
    print(f"Dataset Ch3 généré avec succès : {output_path} ({len(df)} lignes)")
