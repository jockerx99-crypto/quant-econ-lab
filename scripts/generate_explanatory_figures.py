#!/usr/bin/env python3
"""
Générateur de graphiques explicatifs haute résolution pour QuantEcon Lab
Thème : Notion / Stripe Light Aesthetic (minimaliste, sobre, zéro bruit visuel).
Pas de surcharge de légendes : axes clairs, courbes épurées, explications rédigées dessous.
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
# 1. Rendement Arithmétique vs Logarithmique (v2-sql-1)
# ==============================================================================
def make_fig_log_vs_arithmetic():
    fig, ax = plt.subplots(figsize=(7, 3.8), dpi=160)
    
    # Scénario : 100€ -> Choc -50% (50€) -> Rebond +50% (75€) -> Choc -50% (37.5€) -> Rebond +100% (75€)
    etapes = ['Départ (t=0)', 'Choc -50% (t=1)', 'Rebond +50% (t=2)', 'Choc -50% (t=3)', 'Rebond +100% (t=4)']
    x = np.arange(len(etapes))
    valeur_reelle = [100.0, 50.0, 75.0, 37.5, 75.0]
    illusion_arithmetique = [100.0, 50.0, 100.0, 50.0, 150.0]  # Somme simple des % (faux !)
    
    ax.plot(x, illusion_arithmetique, color='#f59e0b', linestyle='--', linewidth=2.0, alpha=0.85, label='Illusion Arithmétique (Somme des %)')
    ax.plot(x, valeur_reelle, color='#0284c7', linewidth=2.5, marker='o', markersize=6, label='Valeur Réelle du Portefeuille (€)')
    
    # Ligne de capital initial
    ax.axhline(100.0, color='#a8a29e', linestyle=':', linewidth=1.2)
    ax.text(0.1, 102.5, 'Capital Initial (100 €)', color='#78716c', fontsize=9, fontweight='medium')
    
    # Marqueur de la perte finale
    ax.scatter([4], [75.0], color='#e11d48', s=90, zorder=5)
    ax.annotate('Capital final réel : 75 €\n(Perte nette de -25%)', xy=(4, 75.0), xytext=(2.7, 58),
                arrowprops=dict(arrowstyle='->', color='#e11d48', lw=1.2),
                color='#e11d48', fontsize=9.5, fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.4', facecolor='#fff1f2', edgecolor='#fecdd3', lw=1))

    ax.set_xticks(x)
    ax.set_xticklabels(etapes, fontsize=8.5)
    ax.set_ylabel('Valeur du Portefeuille (€)', fontsize=10, fontweight='medium')
    ax.set_title('Asymétrie des Rendements : Pourquoi la somme des pourcentages est trompeuse', fontsize=11, fontweight='bold', pad=12)
    ax.legend(frameon=True, facecolor='#ffffff', edgecolor='#e7e5e4', fontsize=9, loc='upper left')
    ax.grid(True, axis='y')
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_log_vs_arithmetic_returns.png')
    fig.savefig(path)
    plt.close(fig)
    print("Generated:", path)

# ==============================================================================
# 2. Signal Golden Cross (v2-sql-3)
# ==============================================================================
def make_fig_golden_cross():
    fig, ax = plt.subplots(figsize=(7, 3.8), dpi=160)
    
    np.random.seed(101)
    t = np.arange(60)
    trend = np.concatenate([np.linspace(100, 92, 20), np.linspace(92, 115, 40)])
    noise = np.random.randn(60) * 1.5
    price = trend + noise
    
    # Moyennes mobiles
    sma_rapide = np.convolve(price, np.ones(5)/5, mode='valid')
    sma_lente = np.convolve(price, np.ones(18)/18, mode='valid')
    
    t_rapide = np.arange(4, 60)
    t_lente = np.arange(17, 60)
    
    ax.plot(t, price, color='#d6d3d1', linewidth=1.2, alpha=0.9, label='Cours Quotidien')
    ax.plot(t_rapide, sma_rapide, color='#0284c7', linewidth=2.2, label='Moyenne Rapide (SMA 5j)')
    ax.plot(t_lente, sma_lente, color='#f59e0b', linewidth=2.2, label='Moyenne Lente (SMA 20j)')
    
    # Point de croisement (Golden Cross)
    idx_cross = 28
    ax.scatter([t[idx_cross]], [price[idx_cross]], color='#10b981', s=110, zorder=6)
    ax.annotate('Golden Cross\n(Signal d\'Achat)', xy=(t[idx_cross], price[idx_cross]), xytext=(t[idx_cross]-12, price[idx_cross]+8),
                arrowprops=dict(arrowstyle='->', color='#10b981', lw=1.5),
                color='#047857', fontsize=9.5, fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.35', facecolor='#ecfdf5', edgecolor='#a7f3d0', lw=1))

    ax.set_xlabel('Séances de Bourse (Temps)', fontsize=10)
    ax.set_ylabel('Cours de Clôture (€)', fontsize=10)
    ax.set_title('Détection Quantitative de Tendance : Le Croisement de Moyennes Mobiles', fontsize=11, fontweight='bold', pad=12)
    ax.legend(frameon=True, facecolor='#ffffff', edgecolor='#e7e5e4', fontsize=9, loc='upper left')
    ax.grid(True)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_golden_cross.png')
    fig.savefig(path)
    plt.close(fig)
    print("Generated:", path)

# ==============================================================================
# 3. Maximum Drawdown & High Watermark (v2-sql-4)
# ==============================================================================
def make_fig_maximum_drawdown():
    fig, ax = plt.subplots(figsize=(7, 3.8), dpi=160)
    
    np.random.seed(42)
    T = 100
    t = np.arange(T)
    ret = np.random.randn(T) * 0.018 + 0.001
    ret[35:45] = -0.035 # Krach temporaire
    ret[45:65] = 0.022  # Reprise
    price = 100.0 * np.exp(np.cumsum(ret))
    
    peak = np.maximum.accumulate(price)
    drawdown = (price - peak) / peak
    mdd_idx = np.argmin(drawdown)
    
    ax.plot(t, price, color='#0284c7', linewidth=2.0, label='Valeur du Portefeuille (€)')
    ax.plot(t, peak, color='#e11d48', linewidth=1.5, linestyle='--', label='Sommet Cumulé (High Watermark)')
    ax.fill_between(t, price, peak, color='#fee2e2', alpha=0.6, label='Zone de Drawdown (Pertes)')
    
    # Marqueur du pire creux
    ax.scatter([t[mdd_idx]], [price[mdd_idx]], color='#be123c', s=90, zorder=5)
    ax.annotate(f'Maximum Drawdown\n({drawdown[mdd_idx]:.1%})', xy=(t[mdd_idx], price[mdd_idx]), xytext=(t[mdd_idx]+6, price[mdd_idx]-12),
                arrowprops=dict(arrowstyle='->', color='#be123c', lw=1.5),
                color='#9f1239', fontsize=9.5, fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.35', facecolor='#fff1f2', edgecolor='#fecdd3', lw=1))

    ax.set_xlabel('Jours Ouvrés', fontsize=10)
    ax.set_ylabel('Valeur Liquidative (€)', fontsize=10)
    ax.set_title('Anatomie du Risque Asymétrique : Le Maximum Drawdown (Peak-to-Trough)', fontsize=11, fontweight='bold', pad=12)
    ax.legend(frameon=True, facecolor='#ffffff', edgecolor='#e7e5e4', fontsize=9, loc='upper left')
    ax.grid(True)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_maximum_drawdown.png')
    fig.savefig(path)
    plt.close(fig)
    print("Generated:", path)

# ==============================================================================
# 4. Décomposition Spectrale & Ellipse de Covariance (v2-py-3)
# ==============================================================================
def make_fig_spectral_covariance():
    fig, ax = plt.subplots(figsize=(7, 3.8), dpi=160)
    
    np.random.seed(7)
    # Matrice de covariance 2D corrélée
    Sigma = np.array([[0.04, 0.025], [0.025, 0.03]])
    L = np.linalg.cholesky(Sigma)
    Z = np.random.randn(2, 600)
    X = L @ Z
    
    evals, evecs = np.linalg.eigh(Sigma)
    
    ax.scatter(X[0] * 100, X[1] * 100, color='#94a3b8', alpha=0.35, s=15, edgecolors='none', label='Rendements Conjoints Observés')
    
    # Tracé des deux vecteurs propres comme axes d'inertie
    centre = np.array([0, 0])
    v1 = evecs[:, 1] * np.sqrt(evals[1]) * 2.2 * 100
    v2 = evecs[:, 0] * np.sqrt(evals[0]) * 2.2 * 100
    
    ax.annotate('', xy=(v1[0], v1[1]), xytext=(0, 0), arrowprops=dict(arrowstyle='->', color='#0284c7', lw=3.0))
    ax.annotate('', xy=(v2[0], v2[1]), xytext=(0, 0), arrowprops=dict(arrowstyle='->', color='#e11d48', lw=2.5))
    
    ax.text(v1[0]*1.1, v1[1]*1.1, 'Axe Principal (v1, lambda_1)\nFacteur Systémique Majeur', color='#0369a1', fontsize=9, fontweight='bold')
    ax.text(v2[0]*1.15, v2[1]*1.15, 'Axe Secondaire (v2, lambda_2)\nFacteur Résiduel', color='#be123c', fontsize=9, fontweight='bold')
    
    ax.axhline(0, color='#e7e5e4', lw=1)
    ax.axvline(0, color='#e7e5e4', lw=1)
    ax.set_xlabel('Rendement Actif A (%)', fontsize=10)
    ax.set_ylabel('Rendement Actif B (%)', fontsize=10)
    ax.set_title('Décomposition Spectrale : Les Axes Principaux d\'Inertie de la Covariance', fontsize=11, fontweight='bold', pad=12)
    ax.grid(True)
    ax.set_aspect('equal', adjustable='datalim')
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_spectral_covariance.png')
    fig.savefig(path)
    plt.close(fig)
    print("Generated:", path)

# ==============================================================================
# 5. PCA de la Courbe des Taux (Litterman-Scheinkman) (v2-py-5)
# ==============================================================================
def make_fig_pca_yield_curve():
    fig, ax = plt.subplots(figsize=(7, 3.8), dpi=160)
    
    maturites = np.array([1, 2, 5, 10, 20, 30])
    base_curve = np.array([2.5, 2.7, 3.0, 3.2, 3.4, 3.45])
    
    # 3 facteurs invariants
    pc1_level = base_curve + 0.60 # Translation parallèle
    pc2_slope = base_curve + np.array([-0.50, -0.35, -0.05, 0.20, 0.45, 0.60]) # Pentification
    pc3_curvature = base_curve + np.array([-0.10, 0.15, 0.45, 0.20, -0.15, -0.20]) # Bosse
    
    ax.plot(maturites, base_curve, color='#475569', linewidth=2.2, marker='o', label='Courbe Initiale de Référence')
    ax.plot(maturites, pc1_level, color='#0284c7', linewidth=2.0, linestyle='--', marker='s', label='PC1 : Effet Niveau (Level ~85% de la variance)')
    ax.plot(maturites, pc2_slope, color='#f59e0b', linewidth=2.0, linestyle='-.', marker='^', label='PC2 : Effet Pente (Slope ~10% de la variance)')
    ax.plot(maturites, pc3_curvature, color='#10b981', linewidth=2.0, linestyle=':', marker='d', label='PC3 : Effet Courbure (Curvature ~3% de la variance)')
    
    ax.set_xticks(maturites)
    ax.set_xticklabels(['1 an', '2 ans', '5 ans', '10 ans', '20 ans', '30 ans'])
    ax.set_xlabel('Maturité de l\'Obligation Souveraine', fontsize=10)
    ax.set_ylabel('Taux de Rendement (%)', fontsize=10)
    ax.set_title('Les 3 Mouvements Invariants de la Courbe des Taux (Modèle de Litterman & Scheinkman)', fontsize=11, fontweight='bold', pad=12)
    ax.legend(frameon=True, facecolor='#ffffff', edgecolor='#e7e5e4', fontsize=8.5, loc='lower right')
    ax.grid(True)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_pca_yield_curve.png')
    fig.savefig(path)
    plt.close(fig)
    print("Generated:", path)

# ==============================================================================
# 6. Frontière Efficiente de Markowitz & GMVP (v2-py-8 / v2-py-9 / v2-py-10)
# ==============================================================================
def make_fig_markowitz_frontier():
    fig, ax = plt.subplots(figsize=(7, 3.8), dpi=160)
    
    # Paramètres de frontière
    mu_targets = np.linspace(4.0, 13.0, 100)
    # Parabole de variance
    A, B, C = 150.0, 11.5, 1.15
    Delta = A * C - B**2
    vols = np.sqrt((A * (mu_targets/100)**2 - 2*B*(mu_targets/100) + C) / Delta) * 100
    
    # GMVP (sommet de la parabole)
    gmvp_vol = np.sqrt(1.0 / A) * 100
    gmvp_mu = (B / A) * 100
    
    # Séparation branche efficiente vs inefficace
    mask_eff = mu_targets >= gmvp_mu
    mask_ineff = mu_targets <= gmvp_mu
    
    ax.plot(vols[mask_ineff], mu_targets[mask_ineff], color='#cbd5e1', linewidth=2.0, linestyle='--', label='Branche Inefficiente (Inférieure)')
    ax.plot(vols[mask_eff], mu_targets[mask_eff], color='#0284c7', linewidth=2.8, label='Frontière Efficiente de Markowitz')
    
    # Point GMVP
    ax.scatter([gmvp_vol], [gmvp_mu], color='#e11d48', s=90, zorder=6)
    ax.text(gmvp_vol + 0.35, gmvp_mu - 0.2, 'GMVP\n(Variance Minimale)', color='#be123c', fontsize=9, fontweight='bold')
    
    # Actif sans risque et droite CML vers le portefeuille de tangence
    rf = 2.5
    tang_vol = 12.0
    tang_mu = 10.2
    cml_vols = np.linspace(0, 16, 50)
    cml_mus = rf + (tang_mu - rf) / tang_vol * cml_vols
    
    ax.plot(cml_vols, cml_mus, color='#10b981', linewidth=2.0, linestyle='-.', label='Capital Market Line (CML avec actif sans risque)')
    ax.scatter([0], [rf], color='#10b981', s=60, zorder=5)
    ax.text(0.3, rf + 0.3, 'Taux sans risque rf (2.5%)', color='#047857', fontsize=8.5, fontweight='medium')
    
    ax.scatter([tang_vol], [tang_mu], color='#047857', s=80, zorder=6)
    ax.text(tang_vol + 0.35, tang_mu - 0.4, 'Portefeuille de Tangence\n(Ratio de Sharpe Maximal)', color='#047857', fontsize=9, fontweight='bold')
    
    # Quelques actifs individuels
    actifs_vols = [14.0, 18.0, 11.5, 16.5]
    actifs_mus = [8.5, 9.2, 6.8, 11.0]
    ax.scatter(actifs_vols, actifs_mus, color='#94a3b8', s=45, alpha=0.8, label='Actifs Individuels')
    
    ax.set_xlabel('Volatilité du Portefeuille sigma_p (%)', fontsize=10)
    ax.set_ylabel('Rendement Espéré E[R_p] (%)', fontsize=10)
    ax.set_title('Théorie Moderne de Portefeuille : Frontière Efficiente, GMVP et Droite CML', fontsize=11, fontweight='bold', pad=12)
    ax.legend(frameon=True, facecolor='#ffffff', edgecolor='#e7e5e4', fontsize=8.5, loc='upper left')
    ax.grid(True)
    ax.set_xlim(-0.5, 20)
    ax.set_ylim(1.5, 14.5)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_markowitz_efficient_frontier.png')
    fig.savefig(path)
    plt.close(fig)
    print("Generated:", path)

# ==============================================================================
# 7. Queues Épaisses (Fat Tails) vs Loi Normale (v2-py-14 / v2-py-15)
# ==============================================================================
def make_fig_fat_tails():
    fig, ax = plt.subplots(figsize=(7, 3.8), dpi=160)
    
    x = np.linspace(-4.5, 4.5, 400)
    # Loi Normale
    norm_pdf = (1.0 / np.sqrt(2 * np.pi)) * np.exp(-0.5 * x**2)
    # Loi de Student df=3 (leptokurtique, queues épaisses)
    from scipy.stats import t as student_t
    student_pdf = student_t.pdf(x, df=3)
    
    ax.plot(x, norm_pdf, color='#94a3b8', linewidth=1.8, linestyle='--', label='Loi Normale Théorique N(0, 1)')
    ax.plot(x, student_pdf, color='#0284c7', linewidth=2.4, label='Distribution Financière Réelle (Queues Épaisses)')
    
    # Zone d'alerte des krachs
    mask_crash = x <= -2.5
    ax.fill_between(x[mask_crash], 0, student_pdf[mask_crash], color='#fee2e2', alpha=0.7)
    ax.fill_between(x[mask_crash], 0, norm_pdf[mask_crash], color='#fecdd3', alpha=0.9)
    
    ax.annotate('Zone des Krachs de Marché :\nProbabilité réelle très supérieure\naux prédictions gaussiennes',
                xy=(-2.8, 0.02), xytext=(-4.3, 0.16),
                arrowprops=dict(arrowstyle='->', color='#e11d48', lw=1.5),
                color='#9f1239', fontsize=8.5, fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.35', facecolor='#fff1f2', edgecolor='#fecdd3', lw=1))
    
    ax.set_xlabel('Rendement Normalisé (Écarts-types z)', fontsize=10)
    ax.set_ylabel('Densité de Probabilité', fontsize=10)
    ax.set_title('Leptokurtose : Pourquoi la Loi Normale Sous-Estime Systématiquement les Krachs', fontsize=11, fontweight='bold', pad=12)
    ax.legend(frameon=True, facecolor='#ffffff', edgecolor='#e7e5e4', fontsize=9, loc='upper right')
    ax.grid(True)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_fat_tails_jarque_bera.png')
    fig.savefig(path)
    plt.close(fig)
    print("Generated:", path)

# ==============================================================================
# 8. Mouvement Brownien vs Sauts de Merton (v2-py-19 / v2-py-27)
# ==============================================================================
def make_fig_gbm_vs_merton():
    fig, ax = plt.subplots(figsize=(7, 3.8), dpi=160)
    
    np.random.seed(42)
    T = 1.0
    N = 252
    dt = T / N
    temps = np.linspace(0, T, N + 1)
    
    # 1. GBM standard
    Z = np.random.randn(N)
    log_gbm = np.cumsum((0.05 - 0.5 * 0.20**2) * dt + 0.20 * np.sqrt(dt) * Z)
    gbm_path = 100.0 * np.exp(np.insert(log_gbm, 0, 0))
    
    # 2. Merton Jump Diffusion (avec 2 sauts discrets)
    merton_log = (0.05 - 0.5 * 0.20**2) * dt + 0.20 * np.sqrt(dt) * Z
    merton_log[80] -= 0.18  # Choc flash crash -18%
    merton_log[170] -= 0.12 # Deuxième secousse -12%
    merton_path = 100.0 * np.exp(np.insert(np.cumsum(merton_log), 0, 0))
    
    ax.plot(temps, gbm_path, color='#0284c7', linewidth=1.8, label='GBM Continu Classique (Black-Scholes)')
    ax.plot(temps, merton_path, color='#7c3aed', linewidth=2.2, label='Modèle à Sauts de Merton (Jump-Diffusion)')
    
    # Marqueur des sauts
    ax.scatter([temps[81]], [merton_path[81]], color='#e11d48', s=80, zorder=5)
    ax.annotate('Saut de Poisson Instantané\n(Flash Crash)', xy=(temps[81], merton_path[81]), xytext=(temps[81]+0.06, merton_path[81]-10),
                arrowprops=dict(arrowstyle='->', color='#e11d48', lw=1.5),
                color='#9f1239', fontsize=8.5, fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.3', facecolor='#fff1f2', edgecolor='#fecdd3', lw=1))
    
    ax.set_xlabel('Horizon Temporel (Années)', fontsize=10)
    ax.set_ylabel('Cours du Sous-Jacent (€)', fontsize=10)
    ax.set_title('Modélisation Stochastique : Diffusion Continue vs Discontinuités de Saut', fontsize=11, fontweight='bold', pad=12)
    ax.legend(frameon=True, facecolor='#ffffff', edgecolor='#e7e5e4', fontsize=9, loc='upper left')
    ax.grid(True)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_gbm_vs_merton_jump.png')
    fig.savefig(path)
    plt.close(fig)
    print("Generated:", path)

# ==============================================================================
# 9. Modèle de Taux de Vasicek (v2-py-29)
# ==============================================================================
def make_fig_vasicek():
    fig, ax = plt.subplots(figsize=(7, 3.8), dpi=160)
    
    np.random.seed(33)
    T = 4.0
    N = 400
    dt = T / N
    temps = np.linspace(0, T, N + 1)
    
    theta = 0.035 # Taux cible 3.5%
    kappa = 0.60  # Vitesse de rappel
    sigma = 0.012
    
    # 4 trajectoires partant de différents points
    depart_taux = [0.065, 0.050, 0.020, 0.005]
    colors = ['#0284c7', '#38bdf8', '#818cf8', '#6366f1']
    
    for r0, col in zip(depart_taux, colors):
        r = np.zeros(N + 1)
        r[0] = r0
        for t in range(N):
            Z = np.random.randn()
            r[t+1] = r[t] + kappa * (theta - r[t]) * dt + sigma * np.sqrt(dt) * Z
        ax.plot(temps, r * 100, color=col, linewidth=1.5, alpha=0.85)
    
    # Ligne d'équilibre theta
    ax.axhline(theta * 100, color='#e11d48', linewidth=2.2, linestyle='--', label=f'Taux d\'Équilibre Long Terme theta = {theta:.1%}')
    ax.text(0.1, theta * 100 + 0.2, 'Niveau d\'équilibre structurel des Banques Centrales', color='#be123c', fontsize=8.5, fontweight='bold')
    
    ax.set_xlabel('Horizon Temporel (Années)', fontsize=10)
    ax.set_ylabel('Taux d\'Intérêt Court (%)', fontsize=10)
    ax.set_title('Processus d\'Ornstein-Uhlenbeck (Vasicek) : La Force de Rappel vers la Moyenne', fontsize=11, fontweight='bold', pad=12)
    ax.legend(frameon=True, facecolor='#ffffff', edgecolor='#e7e5e4', fontsize=9, loc='upper right')
    ax.grid(True)
    
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'fig_vasicek_mean_reversion.png')
    fig.savefig(path)
    plt.close(fig)
    print("Generated:", path)

if __name__ == '__main__':
    print("Génération des figures explicatives Matplotlib...")
    make_fig_log_vs_arithmetic()
    make_fig_golden_cross()
    make_fig_maximum_drawdown()
    make_fig_spectral_covariance()
    make_fig_pca_yield_curve()
    make_fig_markowitz_frontier()
    make_fig_fat_tails()
    make_fig_gbm_vs_merton()
    make_fig_vasicek()
    print("Toutes les figures ont été générées avec succès dans :", OUTPUT_DIR)
