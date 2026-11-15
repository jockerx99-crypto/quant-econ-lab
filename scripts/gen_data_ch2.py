#!/usr/bin/env python3
"""
Générateur de données pour le Chapitre 2 : Sinistralité & Tarification de Flotte
Données riches pour GROUP BY, HAVING, agrégations, et détection d'outliers (méthode IQR).
"""
import os
import numpy as np
import pandas as pd

def generate_ch2_data(n_samples=800, random_state=123):
    np.random.seed(random_state)
    
    sinistre_ids = np.arange(50001, 50001 + n_samples)
    police_ids = np.random.choice(np.arange(10001, 10600), size=n_samples)
    
    categories = np.random.choice(['Poids Lourd', 'Véhicule Léger', 'Deux-Roues', 'Engin Chantier'], size=n_samples, p=[0.25, 0.45, 0.15, 0.15])
    regions = np.random.choice(['IDF', 'PACA', 'Grand Est', 'Bretagne', 'Occitanie'], size=n_samples, p=[0.35, 0.20, 0.18, 0.15, 0.12])
    natures = np.random.choice(['Collision', 'Vol', 'Incendie', 'Bris de Glace', 'Responsabilité Civile'], size=n_samples, p=[0.40, 0.15, 0.08, 0.25, 0.12])
    
    # Coûts selon la nature
    couts = []
    for nat in natures:
        if nat == 'Bris de Glace':
            c = np.random.normal(450, 80)
        elif nat == 'Collision':
            c = np.random.lognormal(7.5, 0.8)
        elif nat == 'Vol':
            c = np.random.lognormal(9.2, 0.6)
        elif nat == 'Incendie':
            c = np.random.lognormal(9.6, 0.5)
        else:
            c = np.random.lognormal(8.0, 1.2)
        couts.append(max(50.0, round(float(c), 2)))
        
    couts = np.array(couts)
    
    # Primes encaissées associées à la police
    primes = np.where(categories == 'Poids Lourd', 3200, np.where(categories == 'Deux-Roues', 680, 1200))
    primes = (primes + np.random.normal(0, 100, n_samples)).round(2)
    
    # Taux de responsabilité (0% à 100%)
    responsabilite = np.random.choice([0.0, 50.0, 100.0], size=n_samples, p=[0.35, 0.15, 0.50])
    
    df = pd.DataFrame({
        'sinistre_id': sinistre_ids,
        'police_id': police_ids,
        'categorie_flotte': categories,
        'region': regions,
        'nature_sinistre': natures,
        'cout_sinistre': couts,
        'prime_police': primes,
        'responsabilite_pct': responsabilite
    })
    
    # Valeurs nulles intentionnelles
    null_idx = np.random.choice(n_samples, size=20, replace=False)
    df.loc[null_idx[:10], 'cout_sinistre'] = np.nan
    df.loc[null_idx[10:], 'categorie_flotte'] = np.nan
    
    # Outliers intentionnels (valeurs négatives aberrantes de saisie + sinistre géant)
    df.loc[3, 'cout_sinistre'] = -1500.00  # Erreur de saisie comptable à nettoyer
    df.loc[45, 'cout_sinistre'] = 450000.00 # Sinistre industriel hors-norme
    
    return df

if __name__ == '__main__':
    target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public', 'data'))
    os.makedirs(target_dir, exist_ok=True)
    df = generate_ch2_data()
    output_path = os.path.join(target_dir, 'ch2_sinistralite_flotte.csv')
    df.to_csv(output_path, index=False)
    print(f"Dataset Ch2 généré avec succès : {output_path} ({len(df)} lignes)")
