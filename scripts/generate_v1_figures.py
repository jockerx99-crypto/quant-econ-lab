#!/usr/bin/env python3
"""
Générateur de graphiques explicatifs haute résolution pour la Version 1 de QuantEcon Lab
Thème : Notion / Stripe Light Aesthetic (minimaliste, sobre, zéro bruit visuel).
Pas de surcharge de légendes : axes clairs, tracés épurés, explications rédigées dessous.
"""

import os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

OUTPUT_DIR = '/Users/lucaspasqualis/quant-econ-lab/public/images/theory'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Configuration graphique minimaliste et moderne
plt.rcParams['font.sans-serif'] = 'Helvetica, Arial, sans-serif'
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['figure.facecolor'] = '#ffffff'
plt.rcParams['axes.facecolor'] = '#fafaf9'
plt.rcParams['axes.edgecolor'] = '#e7e5e4'
plt.rcParams['axes.linewidth'] = 1.0
plt.rcParams['axes.spines.top'] = False
plt.rcParams['axes.spines.right'] = False
plt.rcParams['grid.color'] = '#f5f5f4'
plt.rcParams['grid.linestyle'] = '-'
plt.rcParams['grid.linewidth'] = 1.0
plt.rcParams['xtick.color'] = '#78716c'
plt.rcParams['ytick.color'] = '#78716c'
plt.rcParams['text.color'] = '#1c1917'
plt.rcParams['axes.labelcolor'] = '#292524'
plt.rcParams['font.size'] = 10

# ==============================================================================
# 1. GROUP BY & Agrégations : Le paradigme Split - Apply - Combine (sql-14)
# ==============================================================================
def make_fig_sql_groupby():
    fig, ax = plt.subplots(figsize=(7.2, 3.8), dpi=160)
    
    # 3 Régions avec différentes primes
    categories = ['Région Nord\n(4 polices)', 'Région Sud\n(3 polices)', 'Région Ouest\n(5 polices)']
    valeurs_brutes = [
        [450, 520, 480, 510],
        [680, 720, 650],
        [390, 410, 420, 380, 440]
    ]
    moyennes = [np.mean(v) for v in valeurs_brutes]
    x = np.arange(len(categories))
    
    # Barres des moyennes agrégées
    bars = ax.bar(x, moyennes, width=0.45, color='#e0f2fe', edgecolor='#0284c7', linewidth=1.5, zorder=2)
    
    # Points des observations individuelles (lignes brutes)
    np.random.seed(42)
    for i, vals in enumerate(valeurs_brutes):
        jitter = np.random.uniform(-0.12, 0.12, size=len(vals))
        ax.scatter([x[i] + j for j in jitter], vals, color='#0369a1', s=45, alpha=0.85, zorder=3)
        # Valeur moyenne écrite au-dessus
        ax.text(x[i], moyennes[i] + 25, f'AVG = {moyennes[i]:.0f} €', ha='center', va='bottom',
                fontsize=9.5, fontweight='bold', color='#0284c7')

    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=9.5)
    ax.set_ylabel('Primes individuelles et Prime moyenne (€)')
    ax.set_title('Mécanisme SQL : GROUP BY & Fonction d\'Agrégation AVG()', fontsize=11, fontweight='bold', pad=12)
    ax.set_ylim(300, 800)
    ax.grid(True, axis='y', alpha=0.7)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_v1_sql_groupby.png')
    fig.savefig(path)
    plt.close(fig)
    print(f'Généré : {path}')

# ==============================================================================
# 2. Jointures Relationnelles : INNER JOIN vs LEFT JOIN en Actuariat (sql-20)
# ==============================================================================
def make_fig_sql_joins():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.6, 3.6), dpi=160)
    
    # Diagramme 1 : INNER JOIN (perte des assurés sains)
    circle_a1 = plt.Circle((0.38, 0.5), 0.32, color='#e2e8f0', alpha=0.4)
    circle_b1 = plt.Circle((0.62, 0.5), 0.32, color='#e2e8f0', alpha=0.4)
    ax1.add_patch(circle_a1)
    ax1.add_patch(circle_b1)
    
    # Intersection colorée
    clip_circle = plt.Circle((0.62, 0.5), 0.32, transform=ax1.transData)
    inter_circle = plt.Circle((0.38, 0.5), 0.32, color='#e11d48', alpha=0.75, clip_path=clip_circle)
    ax1.add_patch(inter_circle)
    
    ax1.text(0.24, 0.5, 'Assurés sains\n(PERDUS !)', ha='center', va='center', fontsize=8, color='#dc2626', fontweight='bold')
    ax1.text(0.5, 0.5, 'Sinistrés\n(Match)', ha='center', va='center', fontsize=8, color='#ffffff', fontweight='bold')
    ax1.text(0.76, 0.5, 'Sinistres', ha='center', va='center', fontsize=8, color='#64748b')
    ax1.set_title('INNER JOIN : Risque de Biais Énorme\n(Assurés sans sinistre ignorés)', fontsize=9.5, fontweight='bold', color='#be123c', pad=8)
    ax1.set_xlim(0, 1)
    ax1.set_ylim(0, 1)
    ax1.axis('off')

    # Diagramme 2 : LEFT JOIN (préservation de l'exposition)
    circle_a2 = plt.Circle((0.38, 0.5), 0.32, color='#0284c7', alpha=0.6)
    circle_b2 = plt.Circle((0.62, 0.5), 0.32, color='#e2e8f0', alpha=0.4)
    ax2.add_patch(circle_a2)
    ax2.add_patch(circle_b2)
    
    ax2.text(0.24, 0.5, 'Assurés sains\n(Conservés !)', ha='center', va='center', fontsize=8, color='#ffffff', fontweight='bold')
    ax2.text(0.5, 0.5, 'Sinistrés\n(Match)', ha='center', va='center', fontsize=8, color='#ffffff', fontweight='bold')
    ax2.text(0.76, 0.5, 'Sinistres', ha='center', va='center', fontsize=8, color='#64748b')
    ax2.set_title('LEFT JOIN : Standard Actuariel\n(100% de l\'exposition préservée)', fontsize=9.5, fontweight='bold', color='#0369a1', pad=8)
    ax2.set_xlim(0, 1)
    ax2.set_ylim(0, 1)
    ax2.axis('off')

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_v1_sql_joins.png')
    fig.savefig(path)
    plt.close(fig)
    print(f'Généré : {path}')

# ==============================================================================
# 3. Le Ratio Sinistres à Primes (Loss Ratio S/P) (sql-24)
# ==============================================================================
def make_fig_loss_ratio():
    fig, ax = plt.subplots(figsize=(7.2, 3.6), dpi=160)
    
    annees = ['Année 1', 'Année 2', 'Année 3', 'Année 4', 'Année 5']
    x = np.arange(len(annees))
    loss_ratios = [62.5, 78.0, 94.5, 112.0, 85.0]
    
    # Couleurs conditionnelles : vert si < 80%, orange si 80-100%, rouge si > 100%
    colors = ['#10b981' if lr < 80 else ('#f59e0b' if lr <= 100 else '#e11d48') for lr in loss_ratios]
    
    bars = ax.bar(x, loss_ratios, width=0.45, color=colors, alpha=0.85, edgecolor='#44403c', linewidth=1.0)
    ax.axhline(100.0, color='#e11d48', linestyle='--', linewidth=1.8, label='Seuil de rentabilité technique (S/P = 100%)')
    
    for i, lr in enumerate(loss_ratios):
        ax.text(x[i], lr + 3, f'{lr:.1f}%', ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#1c1917')
        
    ax.set_xticks(x)
    ax.set_xticklabels(annees, fontsize=9.5)
    ax.set_ylabel('Ratio S/P = Sinistres / Primes (%)')
    ax.set_title('Évolution du Loss Ratio S/P et Détection de Sous-Tarification', fontsize=11, fontweight='bold', pad=12)
    ax.set_ylim(0, 130)
    ax.grid(True, axis='y', alpha=0.7)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_v1_loss_ratio.png')
    fig.savefig(path)
    plt.close(fig)
    print(f'Généré : {path}')

# ==============================================================================
# 4. Boîte à Moustaches & IQR de Tukey (py-7)
# ==============================================================================
def make_fig_boxplot_tukey():
    fig, ax = plt.subplots(figsize=(7.2, 3.6), dpi=160)
    
    np.random.seed(101)
    # Données avec quelques outliers
    data_normal = np.random.normal(loc=1200, scale=250, size=200)
    outliers = np.array([2100, 2250, 2400, 2500, 350])
    data = np.concatenate([data_normal, outliers])
    
    bp = ax.boxplot(data, vert=False, patch_artist=True, widths=0.4,
                    boxprops=dict(facecolor='#bae6fd', color='#0284c7', linewidth=1.5),
                    whiskerprops=dict(color='#0284c7', linewidth=1.5),
                    capprops=dict(color='#0284c7', linewidth=1.5),
                    medianprops=dict(color='#e11d48', linewidth=2.0),
                    flierprops=dict(marker='o', markerfacecolor='#e11d48', markeredgecolor='#e11d48', markersize=6))
    
    q1 = np.percentile(data, 25)
    med = np.median(data)
    q3 = np.percentile(data, 75)
    iqr = q3 - q1
    
    # Annotations pédagogiques
    ax.annotate(f'Médiane Q2\n({med:.0f} €)', xy=(med, 1.2), xytext=(med, 1.35),
                ha='center', fontsize=9, fontweight='bold', color='#e11d48',
                arrowprops=dict(arrowstyle='->', color='#e11d48', lw=1.2))
    
    ax.annotate(f'Q1 (25%)\n{q1:.0f} €', xy=(q1, 0.8), xytext=(q1, 0.65),
                ha='center', fontsize=8.5, color='#0284c7',
                arrowprops=dict(arrowstyle='->', color='#0284c7', lw=1.0))
    
    ax.annotate(f'Q3 (75%)\n{q3:.0f} €', xy=(q3, 0.8), xytext=(q3, 0.65),
                ha='center', fontsize=8.5, color='#0284c7',
                arrowprops=dict(arrowstyle='->', color='#0284c7', lw=1.0))
    
    ax.annotate('Valeurs Aberrantes (Outliers)\n> Q3 + 1.5 IQR', xy=(2300, 1.0), xytext=(2200, 1.3),
                ha='center', fontsize=8.5, color='#e11d48', fontweight='bold',
                arrowprops=dict(arrowstyle='->', color='#e11d48', lw=1.2))

    ax.set_yticks([])
    ax.set_xlabel('Coût des sinistres (€)')
    ax.set_title('Anatomie de la Boîte à Moustaches & Règle des 1.5 IQR de Tukey', fontsize=11, fontweight='bold', pad=12)
    ax.set_ylim(0.5, 1.55)
    ax.grid(True, axis='x', alpha=0.7)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_v1_boxplot_tukey.png')
    fig.savefig(path)
    plt.close(fig)
    print(f'Généré : {path}')

# ==============================================================================
# 5. Régression Linéaire OLS et Résidus Minimisés (py-9)
# ==============================================================================
def make_fig_ols_residuals():
    fig, ax = plt.subplots(figsize=(7.2, 3.8), dpi=160)
    
    np.random.seed(42)
    x = np.linspace(20, 70, 25)
    beta0, beta1 = 300.0, 12.5
    y_true = beta0 + beta1 * x
    bruit = np.random.normal(0, 120, size=len(x))
    y_obs = y_true + bruit
    
    # Droite OLS
    ax.plot(x, y_true, color='#0284c7', linewidth=2.2, zorder=2)
    
    # Points observés
    ax.scatter(x, y_obs, color='#1e293b', s=45, zorder=3)
    
    # Segments des résidus verticaux
    for xi, yi, yhat in zip(x[::2], y_obs[::2], y_true[::2]):
        ax.plot([xi, xi], [yi, yhat], color='#e11d48', linestyle=':', linewidth=1.5, zorder=1)
        
    ax.text(32, 1050, 'Résidu verticaux e_i = Y_i - Ŷ_i\n(dont la somme des carrés est minimisée)',
            fontsize=9, color='#e11d48', fontweight='bold', bbox=dict(boxstyle='round,pad=0.4', fc='#fff1f2', ec='#fda4af'))
    
    ax.set_xlabel('Âge de l\'assuré (années)')
    ax.set_ylabel('Prime annuelle demandée (€)')
    ax.set_title('Principe Géométrique des Moindres Carrés Ordinaires (OLS)', fontsize=11, fontweight='bold', pad=12)
    ax.grid(True, alpha=0.6)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_v1_ols_residuals.png')
    fig.savefig(path)
    plt.close(fig)
    print(f'Généré : {path}')

# ==============================================================================
# 6. Test de Student & Zone de Rejet (py-11)
# ==============================================================================
def make_fig_student_test():
    fig, ax = plt.subplots(figsize=(7.2, 3.8), dpi=160)
    
    from scipy import stats
    z = np.linspace(-4, 4, 300)
    density = stats.norm.pdf(z)
    
    ax.plot(z, density, color='#0284c7', linewidth=2.0)
    
    # Zones de rejet (alpha = 5%, seuils +- 1.96)
    z_left = z[z <= -1.96]
    z_right = z[z >= 1.96]
    ax.fill_between(z_left, 0, stats.norm.pdf(z_left), color='#e11d48', alpha=0.45)
    ax.fill_between(z_right, 0, stats.norm.pdf(z_right), color='#e11d48', alpha=0.45)
    
    # Zone d'acceptation de H0
    z_center = z[(z > -1.96) & (z < 1.96)]
    ax.fill_between(z_center, 0, stats.norm.pdf(z_center), color='#e0f2fe', alpha=0.5)
    
    ax.axvline(-1.96, color='#e11d48', linestyle='--', linewidth=1.5)
    ax.axvline(1.96, color='#e11d48', linestyle='--', linewidth=1.5)
    
    ax.text(0, 0.16, 'Zone de Non-Rejet (95%)\nEffet statistiquement non significatif\n(p-valeur > 0.05)',
            ha='center', va='center', fontsize=9, color='#0369a1', fontweight='bold')
    ax.text(2.6, 0.08, 'Zone de Rejet\n(alpha = 5%)\np-valeur < 0.05', ha='center', fontsize=8.5, color='#e11d48', fontweight='bold')
    
    ax.set_xticks([-1.96, 0, 1.96])
    ax.set_xticklabels(['-1.96\n(Seuil critique)', '0\n(H0: beta = 0)', '+1.96\n(Seuil critique)'], fontsize=9)
    ax.set_ylabel('Densité de probabilité')
    ax.set_title('Test de Student : Zone de Décision Statistique & P-Valeur', fontsize=11, fontweight='bold', pad=12)
    ax.set_ylim(0, 0.45)
    ax.grid(True, alpha=0.6)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_v1_student_test.png')
    fig.savefig(path)
    plt.close(fig)
    print(f'Généré : {path}')

# ==============================================================================
# 7. Homoscédasticité vs Hétéroscédasticité (py-18)
# ==============================================================================
def make_fig_heteroscedasticity():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.6, 3.6), dpi=160)
    
    np.random.seed(42)
    n = 120
    x = np.linspace(10, 100, n)
    
    # 1. Homoscédastique : résidus à variance constante
    res_homo = np.random.normal(0, 15, size=n)
    ax1.scatter(x, res_homo, color='#0284c7', s=20, alpha=0.7)
    ax1.axhline(0, color='#1e293b', linestyle='--', linewidth=1.0)
    ax1.axhline(30, color='#0284c7', linestyle=':', linewidth=1.2)
    ax1.axhline(-30, color='#0284c7', linestyle=':', linewidth=1.2)
    ax1.set_title('Homoscédasticité (Idéal OLS)\nVariance des erreurs constante', fontsize=9.5, fontweight='bold', color='#0369a1')
    ax1.set_xlabel('Valeurs Prédites Ŷ')
    ax1.set_ylabel('Résidus e_i')
    ax1.set_ylim(-75, 75)
    ax1.grid(True, alpha=0.5)

    # 2. Hétéroscédastique : variance en entonnoir (croît avec Ŷ)
    res_hetero = np.random.normal(0, 0.65 * x, size=n)
    ax2.scatter(x, res_hetero, color='#e11d48', s=20, alpha=0.7)
    ax2.axhline(0, color='#1e293b', linestyle='--', linewidth=1.0)
    # Lignes d'entonnoir
    ax2.plot(x, 1.3 * x, color='#e11d48', linestyle=':', linewidth=1.2)
    ax2.plot(x, -1.3 * x, color='#e11d48', linestyle=':', linewidth=1.2)
    ax2.set_title('Hétéroscédasticité (Violation OLS)\nForme en entonnoir (Fan Shape)', fontsize=9.5, fontweight='bold', color='#be123c')
    ax2.set_xlabel('Valeurs Prédites Ŷ')
    ax2.set_ylim(-75, 75)
    ax2.grid(True, alpha=0.5)

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_v1_heteroscedasticity.png')
    fig.savefig(path)
    plt.close(fig)
    print(f'Généré : {path}')

# ==============================================================================
# 8. Régression Fallacieuse & Séries Intégrées I(1) (py-21)
# ==============================================================================
def make_fig_spurious_regression():
    fig, ax = plt.subplots(figsize=(7.2, 3.8), dpi=160)
    
    np.random.seed(1337)
    t = np.arange(120)
    # Deux marches aléatoires totalement indépendantes
    walk1 = np.cumsum(np.random.normal(0.2, 1.0, size=120)) + 50.0
    walk2 = np.cumsum(np.random.normal(0.18, 0.9, size=120)) + 30.0
    
    ax.plot(t, walk1, color='#0284c7', linewidth=2.0, label='Série A (ex: Dépenses Sinistres)')
    ax.plot(t, walk2, color='#f59e0b', linewidth=2.0, label='Série B (Totalement indépendante !)')
    
    # Calcul du R2 trompeur
    r = np.corrcoef(walk1, walk2)[0, 1]
    r2 = r**2
    
    ax.text(10, max(walk1.max(), walk2.max()) - 5,
            f'R² fallacieux = {r2:.2f} (corrélation trompeuse !)\nCause : Tendance stochastique commune I(1)\nRemède : Différenciation première ΔY',
            fontsize=9, color='#1e293b', fontweight='bold', bbox=dict(boxstyle='round,pad=0.5', fc='#fef3c7', ec='#f59e0b'))
    
    ax.set_xlabel('Périodes temporelles (Mois)')
    ax.set_ylabel('Niveau des séries')
    ax.set_title('Le Piège de la Régression Fallacieuse sur Séries Non-Stationnaires', fontsize=11, fontweight='bold', pad=12)
    ax.grid(True, alpha=0.6)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_v1_spurious_regression.png')
    fig.savefig(path)
    plt.close(fig)
    print(f'Généré : {path}')

if __name__ == '__main__':
    print('Génération des figures pédagogiques Version 1...')
    make_fig_sql_groupby()
    make_fig_sql_joins()
    make_fig_loss_ratio()
    make_fig_boxplot_tukey()
    make_fig_ols_residuals()
    make_fig_student_test()
    make_fig_heteroscedasticity()
    make_fig_spurious_regression()
    print('Toutes les figures Version 1 sont prêtes !')
