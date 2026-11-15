#!/usr/bin/env python3
"""
Générateur de données pour le Chapitre 1 : Portefeuille d'Assurés
Contient des données réalistes d'assurance avec valeurs nulles et anomalies légères à filtrer.
"""
import os
import numpy as np
import pandas as pd

def generate_ch1_data(n_samples=500, random_state=42):
    np.random.seed(random_state)
    
    police_ids = np.arange(10001, 10001 + n_samples)
    client_ids = [f"CLI-{np.random.randint(10000, 99999)}" for _ in range(n_samples)]
    
    # Ages : distribution bimodale réaliste (jeunes conducteurs + seniors)
    ages = np.concatenate([
        np.random.normal(24, 3, int(n_samples * 0.3)),
        np.random.normal(48, 12, n_samples - int(n_samples * 0.3))
    ]).astype(int)
    ages = np.clip(ages, 18, 85)
    
    sexes = np.random.choice(['M', 'F'], size=n_samples, p=[0.52, 0.48])
    regions = np.random.choice(
        ['IDF', 'Auvergne-Rhône-Alpes', 'PACA', 'Nouvelle-Aquitaine', 'Hauts-de-France', 'Bretagne', 'Occitanie'],
        size=n_samples,
        p=[0.28, 0.18, 0.14, 0.12, 0.10, 0.10, 0.08]
    )
    
    vehicules = np.random.choice(['Citadine', 'Berline', 'SUV', 'Sportive', 'Utilitaire'], size=n_samples, p=[0.40, 0.30, 0.18, 0.05, 0.07])
    
    # Bonus-malus : distribution CRM français (majorité à 0.50, certains avec malus)
    crm = np.random.choice([0.50, 0.54, 0.60, 0.68, 0.76, 0.85, 0.90, 1.00, 1.15, 1.25], size=n_samples, p=[0.45, 0.10, 0.08, 0.07, 0.06, 0.08, 0.06, 0.05, 0.03, 0.02])
    
    # Primes annuelles (€) corrélées au CRM, âge et véhicule
    base_prime = np.where(vehicules == 'Sportive', 1400, np.where(vehicules == 'SUV', 950, 650))
    age_surcharge = np.where(ages < 25, 400, 0)
    primes = (base_prime * crm + age_surcharge + np.random.normal(0, 50, n_samples)).round(2)
    
    # Fréquence de sinistres (0, 1, 2)
    nb_sinistres = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.82, 0.14, 0.03, 0.01])
    
    # Coût total de sinistres pour l'année
    cout_total = np.zeros(n_samples)
    for i in range(n_samples):
        if nb_sinistres[i] > 0:
            # Distribution asymétrique Log-normale
            couts = np.random.lognormal(mean=7.2, sigma=1.1, size=nb_sinistres[i])
            cout_total[i] = np.sum(couts).round(2)
            
    df = pd.DataFrame({
        'police_id': police_ids,
        'client_id': client_ids,
        'age': ages,
        'sexe': sexes,
        'region': regions,
        'type_vehicule': vehicules,
        'bonus_malus': crm,
        'prime_annuelle': primes,
        'nb_sinistres': nb_sinistres,
        'cout_total_sinistres': cout_total
    })
    
    # Injection volontaire de valeurs manquantes (pour forcer le filtrage WHERE / isna)
    missing_indices = np.random.choice(n_samples, size=15, replace=False)
    df.loc[missing_indices[:8], 'bonus_malus'] = np.nan
    df.loc[missing_indices[8:], 'region'] = np.nan
    
    # Injection d'un outlier extrême (sinistre corporel grave)
    outlier_idx = np.random.choice(np.where(df['nb_sinistres'] > 0)[0])
    df.loc[outlier_idx, 'cout_total_sinistres'] = 125000.00
    
    return df

if __name__ == '__main__':
    target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public', 'data'))
    os.makedirs(target_dir, exist_ok=True)
    df = generate_ch1_data()
    output_path = os.path.join(target_dir, 'ch1_portefeuille_assures.csv')
    df.to_csv(output_path, index=False)
    print(f"Dataset Ch1 généré avec succès : {output_path} ({len(df)} lignes)")
