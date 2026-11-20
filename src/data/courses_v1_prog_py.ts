import { CourseModule } from "@/types/course";

export const PYTHON_FINANCE_PROG_MODULE: CourseModule = {
  id: "python-bases-finance",
  title: "Python Programmation : Fonctions, Boucles & Structures (Finance)",
  subtitle: "24 exercices progressifs de programmation pure appliquée à la finance : def, return, boucles for/while, listes et dictionnaires",
  icon: "Code2",
  description: "Parcours progressif de programmation Python pure appliquée à la finance, à l'actuariat IARD et à l'ALM : variables typées, conditions if/elif/else, listes et slicing, dictionnaires, boucles for/enumerate/while, fonctions modulaires def/return, programmation défensive, compréhensions, algorithmes matriciels, simulation Monte Carlo et stress-test de bilan.",
  exercises: [
    {
      id: "py-prog-1",
      title: "1. Placement Composé, Taux Équivalent & f-strings (Variables & Types)",
      category: "alm",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 10,
      description: "Calculez la valeur future composée, les intérêts cumulés et le taux mensuel équivalent d'un placement de 25 000 EUR à 3,5 % sur 4 ans, puis formatez l'affichage avec une f-string.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Capitalisation Composée & Conversion de Fréquence des Taux

#### Intuition Économique & Enjeux ALM
En gestion actif-passif (ALM) bancaire et assurantielle, les intérêts générés à chaque période sont réinvestis et produisent eux-mêmes des intérêts : c'est la **capitalisation composée** (*compounding*). Contrairement aux intérêts simples (linéaires, utilisés sur certains instruments monétaires court terme $< 1$ an), la capitalisation composée modélise la croissance exponentielle d'un bilan, d'un fonds en euros ou d'une réserve mathématique sur plusieurs années.

Par ailleurs, un actif obligataire ou un fonds en euros cote généralement un **taux annuel effectif** $r_{\\text{ann}}$, alors que les décaissements (rentes, mensualités de crédit, rachats mensuels) s'effectuent à maille **mensuelle**. Diviser naïvement $r_{\\text{ann}}$ par $12$ donne un taux *proportionnel* qui surestime ou sous-estime le rendement effectif annuel dès que les intérêts sont capitalisés mensuellement : il faut donc calculer le **taux mensuel équivalent** $r_{\\text{mens}}$.

#### Démonstration Mathématique Formelle
Soit un capital initial $C_0 > 0$ placé pendant $n \\in \\mathbb{N}^*$ années au taux annuel composé $r_{\\text{ann}}$ :

1. **Récurrence de capitalisation :**
   À la fin de l'année $1$, $C_1 = C_0(1 + r_{\\text{ann}})$. Par récurrence immédiate à l'horizon $n$ :

   $$VF = C_n = C_0 (1 + r_{\\text{ann}})^n$$

   Les intérêts totaux générés s'obtiennent par différence :

   $$I = VF - C_0 = C_0 \\left[(1 + r_{\\text{ann}})^n - 1\\right]$$

2. **Équivalence actuarielle annuel / mensuel :**
   Le taux mensuel équivalent $r_{\\text{mens}}$ est l'unique taux tel que $12$ capitalisations mensuelles produisent exactement le même facteur de capitalisation qu'une année complète :

   $$(1 + r_{\\text{mens}})^{12} = 1 + r_{\\text{ann}} \\iff r_{\\text{mens}} = (1 + r_{\\text{ann}})^{1/12} - 1$$

   Par développement limité au premier ordre autour de $r_{\\text{ann}} \\to 0$ (formule de Taylor), $(1 + r_{\\text{ann}})^{1/12} - 1 = \\frac{r_{\\text{ann}}}{12} - \\frac{11}{288} r_{\\text{ann}}^2 + o(r_{\\text{ann}}^2)$ : le taux équivalent est donc toujours **strictement inférieur** au taux proportionnel $r_{\\text{ann}} / 12$ pour $r_{\\text{ann}} > 0$.

### 💻 Masterclass Programmation Python : Variables, Priorité des Opérateurs & f-strings

En Python, une **variable** est une étiquette pointant vers un objet en mémoire typé dynamiquement :
- \`int\` (entier exact de précision arbitraire) : \`annees = 4\` ou \`capital = 25_000\` (le tiret bas \`_\` est un séparateur purement visuel ignoré par l'interpréteur, idéal pour lire les grands montants financiers sans erreur de zéro).
- \`float\` (nombre à virgule flottante IEEE-754 double précision 64 bits) : \`taux = 0.035\`.
- **Priorité des opérateurs (PEMDAS)** : l'exponentiation \`**\` est évaluée *avant* la multiplication \`*\` et la division \`/\`. Ainsi, \`capital * (1 + taux) ** annees\` calcule d'abord \`1 + taux\`, puis élève à la puissance \`annees\`, puis multiplie par \`capital\`. En revanche, pour la racine douzième, les parenthèses autour de \`(1 / 12)\` sont **obligatoires** : écrire \`1.035 ** 1 / 12\` calculerait \`(1.035 ** 1) / 12\` !
- **Chaînes formatées (\`f-strings\`)** : \`f"{valeur:,.2f}"\` insère \`valeur\` arrondie à 2 décimales avec séparateur de milliers, et \`f"{taux:.4%}"\` multiplie automatiquement par $100$ et ajoute \`%\` avec 4 décimales.

\`\`\`python
# Illustration sur le taux OAT 10 ans le plus récent du DataFrame macroéconomique \`df\`
oat_pct = float(df['oat_10y'].iloc[-1])  # 3.10 (exprimé en % dans df)
taux_oat = oat_pct / 100.0               # Conversion indispensable en décimal : 0.031
capital_demo = 100_000                   # Séparateur visuel '_' -> int 100000
horizon = 10

vf_demo = capital_demo * (1 + taux_oat) ** horizon
r_mens_eq = (1 + taux_oat) ** (1 / 12) - 1
r_mens_prop = taux_oat / 12              # Approximation proportionnelle (biaisée)

print(f"OAT 2023-Q4 : {taux_oat:.2%} | VF sur {horizon} ans : {vf_demo:,.2f} EUR")
print(f"Taux mensuel équivalent : {r_mens_eq:.5%} vs proportionnel : {r_mens_prop:.5%}")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
OAT 2023-Q4 : 3.10% | VF sur 10 ans : 135,702.13 EUR
Taux mensuel équivalent : 0.25473% vs proportionnel : 0.25833%
\`\`\`

La différence entre taux équivalent et taux proportionnel ($0.2547\\%$ vs $0.2583\\%$) représente $3.6$ points de base par an en capitalisation mensuelle : sur un encours ALM de plusieurs milliards d'euros, cette précision évite un biais systématique de tarification.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
À partir d'un capital initial de $25\\,000\\text{ EUR}$ placé au taux annuel composé de $3.5\\%$ ($0.035$) pendant $4$ ans, appliquez $VF = C_0(1+r)^n$, calculez les intérêts cumulés $I = VF - C_0$ et le taux mensuel équivalent $r_{\\text{mens}} = (1 + r)^{1/12} - 1$.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement les variables suivantes dans votre script et affichez un résumé formaté par \`f-string\` :
1. \`capital = 25_000\` (entier ou flottant égal à \`25000\`)
2. \`taux = 0.035\`
3. \`annees = 4\`
4. \`vf\` : valeur future composée après \`annees\` années
5. \`interets\` : montant total des intérêts générés (\`vf - capital\`)
6. \`taux_mensuel_eq\` : taux mensuel équivalent \`(1 + taux) ** (1 / 12) - 1\`
7. Affichez \`vf\` (2 décimales) et \`taux_mensuel_eq\` (en \`%\`) via \`print(f"...")\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `capital = 25_000
taux = 0.035
annees = 4

vf = capital * (1 + taux) ** annees
interets = vf - capital
taux_mensuel_eq = (1 + taux) ** (1 / 12) - 1

print(f"Valeur future : {vf:,.2f} EUR | Intérêts : {interets:,.2f} EUR")
print(f"Taux mensuel équivalent : {taux_mensuel_eq:.4%}")`,
      testPythonCode: `assert 'capital' in globals() and capital == 25000, "capital doit valoir 25000."
assert 'taux' in globals() and abs(taux - 0.035) < 1e-9, "taux doit valoir 0.035."
assert 'annees' in globals() and annees == 4, "annees doit valoir 4."
assert 'vf' in globals() and abs(vf - 25000 * (1.035 ** 4)) < 1e-6, "vf incorrecte : utilisez capital * (1 + taux) ** annees."
assert 'interets' in globals() and abs(interets - (vf - 25000)) < 1e-6, "interets doit valoir vf - capital."
assert 'taux_mensuel_eq' in globals() and abs(taux_mensuel_eq - (1.035 ** (1 / 12) - 1)) < 1e-9, "taux_mensuel_eq incorrect : vérifiez les parenthèses autour de (1 / 12)."
`,
      datasets: [],
      hints: [
        "Utilisez l'opérateur ** pour la puissance en Python : vf = capital * (1 + taux) ** annees.",
        "N'oubliez pas les parenthèses autour de (1 / 12) dans (1 + taux) ** (1 / 12) - 1 pour éviter que la division par 12 ne s'applique après l'exposant 1.",
        "Pour formater une f-string : print(f\"VF = {vf:,.2f} EUR | Taux mensuel = {taux_mensuel_eq:.4%}\").",
      ],
      guide: {
        theoryToPracticeLink: `La formule actuarielle $VF = C_0(1+r)^n$ se traduit directement par \`capital * (1 + taux) ** annees\`, tandis que la racine douzième $(1+r)^{1/12} - 1$ impose de parenthéser \`(1 / 12)\` en raison de la priorité de \`**\` sur \`/\`.`,
        stepByStepPlan: [
          "Initialiser les trois paramètres d'entrée : `capital = 25_000`, `taux = 0.035` et `annees = 4`.",
          "Calculer la valeur future composée `vf = capital * (1 + taux) ** annees`.",
          "Calculer les intérêts nets `interets = vf - capital`.",
          "Calculer le taux mensuel équivalent `taux_mensuel_eq = (1 + taux) ** (1 / 12) - 1`.",
          "Afficher les résultats de manière lisible avec une `f-string`.",
        ],
        concepts: [
          {
            symbol: "25_000",
            kind: "Syntaxe",
            roleInExercise: "Littéral entier (`int`) avec séparateur visuel `_` facilitant la lecture des milliers.",
          },
          {
            symbol: "**",
            kind: "Syntaxe",
            roleInExercise: "Opérateur d'exponentiation Python (prioritaire sur `*`, `/` et `+`).",
          },
          {
            symbol: "vf",
            kind: "Variable",
            roleInExercise: "Valeur future composée du placement au bout de `4` ans ($28\\,688.08\\text{ EUR}$).",
          },
          {
            symbol: "interets",
            kind: "Variable",
            roleInExercise: "Gain financier net cumulé (`vf - capital`, soit $3\\,688.08\\text{ EUR}$).",
          },
          {
            symbol: "taux_mensuel_eq",
            kind: "Variable",
            roleInExercise: "Taux mensuel équivalent vérifiant $(1 + r_{\\text{mens}})^{12} = 1 + r_{\\text{ann}}$.",
          },
          {
            symbol: "f\"...{x:,.2f}\"",
            kind: "Syntaxe",
            roleInExercise: "Chaîne formatée (`f-string`) affichant un flottant avec séparateur de milliers et 2 décimales.",
          },
        ],
        guidedCode: `# 1. Paramètres financiers du placement
capital = 25_000
taux = 0.035
annees = 4

# 2. Calcul de la valeur future composée et des intérêts cumulés
vf = capital * (1 + ___) ** ___
interets = vf - ___

# 3. Calcul du taux mensuel équivalent (attention aux parenthèses de l'exposant !)
taux_mensuel_eq = (1 + taux) ** (___ / ___) - 1

# 4. Affichage formaté par f-string
print(f"Valeur future : {vf:,.2f} EUR | Taux mensuel eq. : {taux_mensuel_eq:.4%}")`,
      },
    },
    {
      id: "py-prog-2",
      title: "2. Classification Actuarielle d'un Ratio S/P (if / elif / else)",
      category: "pricing",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 12,
      description: "Implémentez une règle décisionnelle if / elif / else pour qualifier la rentabilité technique d'un portefeuille à partir de son ratio Sinistres/Primes (S/P) et déclencher un booléen d'alerte tarifaire.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Ratio Sinistres à Primes ($S/P$) & Pilotage Tarifaire IARD

#### Intuition Économique & Enjeux Actuariels
En assurance dommages (IARD : Auto, Habitation, Responsabilité Civile), la rentabilité technique d'un segment tarifaire est suivie en continu via le **ratio Sinistres à Primes** (*Loss Ratio*), noté $S/P$. Pour qu'un portefeuille couvre non seulement la charge des sinistres ($S$) mais aussi les frais d'acquisition, de gestion et le coût du capital (Solvabilité II), les assureurs ajoutent au $S/P$ un **ratio de frais** $F/P$ typiquement compris entre $25\\%$ et $30\\%$ afin d'obtenir le **Ratio Combiné** (*Combined Ratio*) :

$$RC = \\frac{S}{P} + \\frac{F}{P} = S/P + F/P$$

- Si $S/P < 70\\%$ : même avec $25\\%$ de frais, $RC < 95\\%$ — le segment génère une marge technique confortable (**Rentable**).
- Si $70\\% \\le S/P \\le 95\\%$ : le ratio combiné approche ou dépasse $100\\%$ — le segment entame sa marge et passe **Sous surveillance** (avec déclenchement d'une alerte de révision tarifaire dès $S/P \\ge 90\\%$).
- Si $S/P > 95\\%$ : compte tenu des frais de gestion, $RC > 120\\%$ — le portefeuille est structurellement **Déficitaire**.

#### Démonstration Mathématique Formelle
Formellement, une grille de classification actuarielle réalise une **partition disjointe** de l'intervalle $[0, +\\infty[$ en $K$ classes mutuellement exclusives $I_1, I_2, I_3$ :

$$I_1 = [0, 70[, \\qquad I_2 = [70, 95], \\qquad I_3 = ]95, +\\infty[$$

Pour tout ratio observé $x \\in \\mathbb{R}_+$, il existe un **unique** indice $k \\in \\{1, 2, 3\\}$ tel que $x \\in I_k$. Cette propriété d'unicité et d'exhaustivité garantit qu'aucun contrat ou segment ne peut rester sans diagnostic ni recevoir deux diagnostics contradictoires. Par ailleurs, la fonction indicatrice d'alerte s'exprime comme un prédicat booléen :

$$\\mathbf{1}_{\\text{alerte}}(x) = \\begin{cases} \\text{True} & \\text{si } x \\ge 90.0 \\\\ \\text{False} & \\text{sinon} \\end{cases}$$

### 💻 Masterclass Programmation Python : Branchements Conditionnels \`if / elif / else\` & Booléens

En Python, une structure \`if / elif / else\` évalue les conditions **de haut en bas** et s'arrête **dès la première branche vraie** (*court-circuit structurel*) :
1. **Ordre des conditions** : grâce à ce court-circuit, si \`ratio_sp < 70.0\` est faux, Python garantit automatiquement que \`ratio_sp >= 70.0\` lorsqu'il atteint le \`elif\`. Inutile d'écrire \`elif 70.0 <= ratio_sp <= 95.0:\` (même si Python autorise le chaînage des comparaisons !) : \`elif ratio_sp <= 95.0:\` suffit et reste parfaitement propre.
2. **Piège classique des \`if\` indépendants** : écrire trois \`if\` séparés au lieu de \`if / elif / else\` casserait la partition (par exemple, \`50 < 70\` et \`50 <= 95\` seraient tous deux vrais et la seconde affectation écraserait la première !).
3. **Indentation (4 espaces)** : en Python, le bloc d'instructions d'un \`if\` est délimité par son retrait de 4 espaces après le caractère \`:\`.
4. **Expression booléenne directe** : plutôt qu'un \`if ratio_sp >= 90.0: alerte = True else: alerte = False\`, une comparaison renvoie déjà un objet \`bool\` (\`True\` ou \`False\`), donc \`alerte_tarif = ratio_sp >= 90.0\` est plus concis et idiomatique.

\`\`\`python
# Exemple exécuté sur les données réelles d'assurance de \`df_assures\` et \`df_sinistres\`
total_primes = float(df_assures['prime_annuelle'].sum())
total_cout = float(df_sinistres['cout_total'].sum())
sp_reel_pct = (total_cout / total_primes) * 100.0

if sp_reel_pct < 70.0:
    statut = "Rentable"
elif sp_reel_pct <= 95.0:
    statut = "Sous surveillance"
else:
    statut = "Déficitaire"

alerte = sp_reel_pct >= 90.0
print(f"Primes : {total_primes:,.2f} EUR | Sinistres : {total_cout:,.2f} EUR")
print(f"S/P portefeuille = {sp_reel_pct:.2f}% -> Diagnostic : {statut} | Alerte : {alerte}")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Primes : 11,306.80 EUR | Sinistres : 48,950.00 EUR
S/P portefeuille = 432.93% -> Diagnostic : Déficitaire | Alerte : True
\`\`\`

Sur le portefeuille réel \`df_assures\` / \`df_sinistres\`, les sinistres graves (vol et corporels) portent le $S/P$ à $432.93\\%$, déclenchant immédiatement le diagnostic \`Déficitaire\` et l'alerte tarifaire.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Soit un segment automobile présentant un ratio Sinistres à Primes exprimé en pourcentage \`ratio_sp = 92.5\`. Appliquez la partition stricte :
- \`ratio_sp < 70.0\` $\\implies$ \`"Rentable"\`
- \`70.0 <= ratio_sp <= 95.0\` $\\implies$ \`"Sous surveillance"\`
- \`ratio_sp > 95.0\` $\\implies$ \`"Déficitaire"\`
Et évaluez le booléen d'alerte tarifaire pour le seuil critique $90.0\\%$.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`ratio_sp = 92.5\`
2. \`diagnostic_risque\` (\`str\`) : déterminé par une structure \`if / elif / else\` selon les seuils ci-dessus
3. \`alerte_tarif\` (\`bool\`) : \`True\` si \`ratio_sp >= 90.0\`, sinon \`False\`
4. Affichez \`diagnostic_risque\` et \`alerte_tarif\` avec \`print(...)\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `ratio_sp = 92.5

if ratio_sp < 70.0:
    diagnostic_risque = "Rentable"
elif ratio_sp <= 95.0:
    diagnostic_risque = "Sous surveillance"
else:
    diagnostic_risque = "Déficitaire"

alerte_tarif = ratio_sp >= 90.0

print(f"S/P = {ratio_sp:.1f}% -> {diagnostic_risque} | Alerte tarif : {alerte_tarif}")`,
      testPythonCode: `assert 'ratio_sp' in globals() and abs(ratio_sp - 92.5) < 1e-9, "ratio_sp doit valoir 92.5."
assert 'diagnostic_risque' in globals() and diagnostic_risque == "Sous surveillance", "diagnostic_risque doit valoir 'Sous surveillance' pour 92.5."
assert 'alerte_tarif' in globals() and isinstance(alerte_tarif, bool) and alerte_tarif is True, "alerte_tarif doit être le booléen True car 92.5 >= 90.0."
`,
      datasets: [],
      hints: [
        "Enchaînez if ratio_sp < 70.0:, puis elif ratio_sp <= 95.0:, puis else: en respectant exactement les chaînes 'Rentable', 'Sous surveillance' et 'Déficitaire'.",
        "N'oubliez pas le double-point ':' à la fin de chaque ligne if/elif/else et l'indentation de 4 espaces.",
        "Pour le booléen, écrivez simplement : alerte_tarif = ratio_sp >= 90.0.",
      ],
      guide: {
        theoryToPracticeLink: `La partition mathématique $[0, 70[, [70, 95], ]95, +\\infty[$ se code directement via \`if / elif / else\`, car chaque condition exclut implicitement les précédentes. L'indicatrice d'alerte $\\mathbf{1}_{x \\ge 90}$ devient l'expression booléenne \`ratio_sp >= 90.0\`.`,
        stepByStepPlan: [
          "Affecter `ratio_sp = 92.5`.",
          "Tester d'abord `if ratio_sp < 70.0:` pour affecter `'Rentable'`.",
          "Poursuivre avec `elif ratio_sp <= 95.0:` pour affecter `'Sous surveillance'`, puis `else:` pour `'Déficitaire'`.",
          "Calculer `alerte_tarif = ratio_sp >= 90.0` et afficher les deux résultats.",
        ],
        concepts: [
          {
            symbol: "if / elif / else",
            kind: "Syntaxe",
            roleInExercise: "Structure conditionnelle mutuellement exclusive évaluant les bornes dans l'ordre.",
          },
          {
            symbol: "ratio_sp",
            kind: "Variable",
            roleInExercise: "Ratio Sinistres/Primes en points de pourcentage (`92.5`).",
          },
          {
            symbol: "diagnostic_risque",
            kind: "Variable",
            roleInExercise: "Chaîne de classification actuarielle (`'Sous surveillance'`).",
          },
          {
            symbol: "alerte_tarif",
            kind: "Variable",
            roleInExercise: "Booléen (`True` ou `False`) indiquant si le seuil critique de $90\\%$ est atteint.",
          },
          {
            symbol: "bool",
            kind: "Syntaxe",
            roleInExercise: "Type logique natif retourné par les opérateurs de comparaison (`<`, `<=`, `>=`).",
          },
        ],
        guidedCode: `ratio_sp = 92.5

# Partition mutuellement exclusive des régimes de sinistralité
if ratio_sp < ___:
    diagnostic_risque = "Rentable"
elif ratio_sp <= ___:
    diagnostic_risque = "Sous surveillance"
else:
    diagnostic_risque = "___"

# Évaluation directe du prédicat booléen
alerte_tarif = ratio_sp >= ___

print(diagnostic_risque, alerte_tarif)`,
      },
    },
    {
      id: "py-prog-3",
      title: "3. Échéancier de Coupons : Listes, Indexation & Slicing",
      category: "alm",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 12,
      description: "Manipulez une liste Python représentant un échéancier de flux obligataires : accès par index positif/négatif, découpage (slicing), ajout d'une prime de remboursement via .append() et somme totale.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Séquence de Cash-Flows Obligataires & Remboursement avec Prime

#### Intuition Économique & Enjeux ALM
Une obligation à taux fixe de nominal $N = 1\\,000\\text{ EUR}$, de maturité $T = 5$ ans et de taux facial $c = 4.5\\%$ verse chaque année un coupon de $C = c \\cdot N = 45\\text{ EUR}$, puis rembourse à l'échéance $T$ le dernier coupon augmenté du nominal ($45 + 1\\,000 = 1\\,045\\text{ EUR}$). Certains titres prévoient également une **prime de remboursement** (*redemption premium*) ou des frais terminaux additionnels versés au dénouement.

En programmation ALM, l'échéancier discret $(CF_1, CF_2, \\dots, CF_T)$ constitue la structure de données fondamentale sur laquelle s'appliquent toutes les formules de valorisation, de sensibilité et d'adossement actif-passif.

#### Démonstration Mathématique Formelle
On modélise l'échéancier comme un vecteur fini de flux $\\mathbf{CF} = (CF_1, CF_2, \\dots, CF_T) \\in \\mathbb{R}^T$. La somme nominale non actualisée des flux versés avant et après ajout d'une prime terminale $\\pi > 0$ s'écrit :

$$S_{\\text{init}} = \\sum_{t=1}^T CF_t = (T-1) \\cdot cN + (cN + N), \\qquad S_{\\text{tot}} = S_{\\text{init}} + \\pi$$

Isoler les coupons intermédiaires $(CF_2, \\dots, CF_{T-1})$ permet de vérifier la régularité de l'annuité périodique indépendamment des flux atypiques d'ouverture ou de remboursement final.

### 💻 Masterclass Programmation Python : Listes (\`list\`), Indexation \`0\`-based, Slicing & Mutabilité

La **liste** (\`list\`) est la séquence ordonnée et **mutable** la plus utilisée en Python :
1. **Indexation à partir de \`0\` vs période $t=1$** : le premier flux ($t=1$) est à l'indice \`coupons[0]\`. L'indexation négative lit à partir de la fin : \`coupons[-1]\` donne le dernier élément, \`coupons[-2]\` l'avant-dernier.
2. **Slicing \`[debut:fin]\` (intervalle semi-ouvert $[a, b[$)** : \`coupons[1:4]\` extrait les éléments d'indices \`1\`, \`2\` et \`3\` (l'indice de fin \`4\` est **exclu** !). Ainsi \`len(coupons[1:4]) == 4 - 1 = 3\`.
3. **Mutabilité et piège de \`.append()\`** : la méthode \`coupons.append(x)\` modifie la liste *en place* et retourne **\`None\`**. Ne jamais écrire \`coupons = coupons.append(10.0)\`, car cela écraserait votre liste par \`None\` !
4. **Fonction native \`sum()\`** : additionne tous les éléments numériques d'une liste en $O(n)$.

\`\`\`python
# Échéancier de test : obligation 4 ans à 3.2% (coupons annuels + nominal 1000)
coupons_oat = [32.0, 32.0, 32.0, 1032.0]
print("Premier coupon (index 0) :", coupons_oat[0])
print("Flux terminal (index -1) :", coupons_oat[-1])
print("Coupons intermédiaires [1:3] :", coupons_oat[1:3])

# Ajout en place d'un bonus terminal de 5.0 EUR
coupons_oat.append(5.0)
print("Liste après .append(5.0) :", coupons_oat)
print("Longueur :", len(coupons_oat), "| Somme nominale :", sum(coupons_oat), "EUR")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Premier coupon (index 0) : 32.0
Flux terminal (index -1) : 1032.0
Coupons intermédiaires [1:3] : [32.0, 32.0]
Liste après .append(5.0) : [32.0, 32.0, 32.0, 1032.0, 5.0]
Longueur : 5 | Somme nominale : 1133.0 EUR
\`\`\`

Remarquez comment le slice \`[1:3]\` exclut l'indice \`3\` et renvoie exactement les 2 coupons intermédiaires, et comment \`.append(5.0)\` allonge la liste en place de 4 à 5 éléments.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Soit l'échéancier initial d'une obligation 5 ans de nominal $1\\,000\\text{ EUR}$ au coupon facial de $4.5\\%$ : \`[45.0, 45.0, 45.0, 45.0, 1045.0]\`. Extrayez le premier flux, le flux terminal initial, les $3$ coupons intermédiaires, puis ajoutez une prime de remboursement de $10.0\\text{ EUR}$ en fin de liste avant de calculer la somme totale des flux.

**Volet 2 — Laboratoire Pratique Python :**
Respectez l'ordre exact des opérations et les noms suivants :
1. Créez \`coupons = [45.0, 45.0, 45.0, 45.0, 1045.0]\`
2. Extrayez \`premier_flux = coupons[0]\`
3. Extrayez \`flux_terminal = coupons[-1]\` (avant l'ajout de la prime !)
4. Extrayez \`coupons_intermediaires = coupons[1:4]\` (les 3 coupons centraux via slicing)
5. Ajoutez \`10.0\` à la fin de \`coupons\` avec \`coupons.append(10.0)\`
6. Calculez \`somme_totale = sum(coupons)\` et affichez le résultat.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `coupons = [45.0, 45.0, 45.0, 45.0, 1045.0]

premier_flux = coupons[0]
flux_terminal = coupons[-1]
coupons_intermediaires = coupons[1:4]

coupons.append(10.0)
somme_totale = sum(coupons)

print("Coupons intermédiaires :", coupons_intermediaires)
print(f"Somme totale avec prime : {somme_totale:,.2f} EUR")`,
      testPythonCode: `assert 'coupons' in globals() and coupons == [45.0, 45.0, 45.0, 45.0, 1045.0, 10.0], "La liste coupons finale doit contenir [45.0, 45.0, 45.0, 45.0, 1045.0, 10.0]."
assert 'premier_flux' in globals() and premier_flux == 45.0, "premier_flux doit valoir 45.0."
assert 'flux_terminal' in globals() and flux_terminal == 1045.0, "flux_terminal doit valoir 1045.0 (capturez-le avant .append(10.0))."
assert 'coupons_intermediaires' in globals() and coupons_intermediaires == [45.0, 45.0, 45.0], "coupons_intermediaires doit être le slice [1:4] égal à [45.0, 45.0, 45.0]."
assert 'somme_totale' in globals() and abs(somme_totale - 1235.0) < 1e-9, "somme_totale doit valoir 1235.0."
`,
      datasets: [],
      hints: [
        "Capturez premier_flux = coupons[0], flux_terminal = coupons[-1] et coupons_intermediaires = coupons[1:4] AVANT d'appeler coupons.append(10.0).",
        "Appelez coupons.append(10.0) sur sa propre ligne sans affecter son retour (coupons = coupons.append(...) écraserait la liste par None !).",
        "Utilisez la fonction native sum(coupons) pour obtenir somme_totale = 1235.0.",
      ],
      guide: {
        theoryToPracticeLink: `La liste Python modélise directement le vecteur de cash-flows $\\mathbf{CF} = (CF_1, \\dots, CF_T)$, à ceci près que Python commence la numérotation à l'indice \`0\` (\`coupons[0]\` pour $CF_1$). Le slicing \`[1:4]\` extrait les indices $1, 2, 3$ et \`.append(10.0)\` ajoute la prime terminale $\\pi = 10$ en place.`,
        stepByStepPlan: [
          "Créer la liste `coupons = [45.0, 45.0, 45.0, 45.0, 1045.0]`.",
          "Lire `premier_flux` à l'indice `0` et `flux_terminal` à l'indice `-1`.",
          "Extraire les 3 coupons intermédiaires par découpage `coupons[1:4]`.",
          "Ajouter `10.0` en fin de liste avec `coupons.append(10.0)`.",
          "Calculer `somme_totale = sum(coupons)` et afficher les valeurs.",
        ],
        concepts: [
          {
            symbol: "coupons[0] / coupons[-1]",
            kind: "Syntaxe",
            roleInExercise: "Accès au premier élément (indice 0) et au dernier élément (indice négatif -1).",
          },
          {
            symbol: "coupons[1:4]",
            kind: "Syntaxe",
            roleInExercise: "Slicing semi-ouvert extrayant les indices 1, 2 et 3 (la borne droite `4` est exclue).",
          },
          {
            symbol: ".append(10.0)",
            kind: "Fonction / Méthode",
            roleInExercise: "Méthode modifiant la liste en place pour ajouter `10.0` à la fin (retourne `None`).",
          },
          {
            symbol: "sum(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction native sommant tous les éléments numériques d'une liste.",
          },
          {
            symbol: "flux_terminal",
            kind: "Variable",
            roleInExercise: "Dernier flux initial (`1045.0`) capturé avant l'ajout de la prime de `10.0`.",
          },
        ],
        guidedCode: `coupons = [45.0, 45.0, 45.0, 45.0, 1045.0]

# 1. Indexation et slicing AVANT modification de la liste
premier_flux = coupons[___]
flux_terminal = coupons[___]
coupons_intermediaires = coupons[___:___]

# 2. Ajout en place (ne jamais écrire coupons = coupons.append(...))
coupons.___(10.0)

# 3. Somme totale
somme_totale = ___(coupons)
print(coupons_intermediaires, somme_totale)`,
      },
    },
    {
      id: "py-prog-4",
      title: "4. Fiche Signalétique Obligataire (Dictionnaires)",
      category: "pricing",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 12,
      description: "Structurez les caractéristiques d'une OAT dans un dictionnaire Python, enrichissez-le dynamiquement avec une nouvelle clé 'valeur_marche' et calculez son coupon annuel et sa décote par rapport au pair.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Cotation en Pourcentage du Pair, Décote & Surcote

#### Intuition Économique & Enjeux de Valorisation
Sur les marchés obligataires souverains et *corporate*, les obligations ne sont pas cotées directement en euros par titre, mais en **pourcentage de leur valeur nominale** (ou *pair*, base $100\\%$). Une OAT de nominal $10\\,000\\text{ EUR}$ cotée à $96.5\\%$ s'échange en réalité à $9\\,650\\text{ EUR}$ : elle cote **sous le pair** (*at a discount*).

Pourquoi une obligation sûre cote-t-elle sous le pair ? Parce que depuis son émission (avec un taux de coupon fixe $c = 3.2\\%$), les taux d'intérêt du marché ($y$) ont monté au-dessus de $3.2\\%$. Pour qu'un acheteur accepte de recevoir des coupons de $3.2\\%$ inférieurs au rendement exigé par le marché, le prix de marché doit baisser sous $100\\%$ afin de lui offrir un gain en capital à l'échéance !

#### Démonstration Mathématique Formelle
Soit une obligation de nominal $N$, de taux de coupon annuel $c$ et de prix de marché exprimé en pourcentage du pair $P_{\\%} \\in \\mathbb{R}_+$ :

1. **Valeur de marché en numéraire :**

   $$V_{\\text{marché}} = N \\times \\frac{P_{\\%}}{100}$$

2. **Coupon annuel détaché :**

   $$C = N \\times c$$

3. **Écart au nominal (surcote si $> 0$, décote si $< 0$) :**

   $$\\Delta_{\\text{pair}} = V_{\\text{marché}} - N = N \\left(\\frac{P_{\\%}}{100} - 1\\right)$$

   On vérifie immédiatement la règle d'arbitrage obligataire : $P_{\\%} < 100 \\iff \\Delta_{\\text{pair}} < 0 \\iff y > c$ (pour un titre sans défaut).

### 💻 Masterclass Programmation Python : Dictionnaires (\`dict\`), Lookup $O(1)$ & Mutation Dynamique

Alors qu'une **liste** associe des valeurs à des positions numériques (\`0, 1, 2...\`), un **dictionnaire (\`dict\`)** associe des **clés uniques** (souvent des chaînes \`'ticker'\`, \`'nominal'\`) à des valeurs via une table de hachage interne :
- **Temps d'accès constant $O(1)$** : \`obligation['nominal']\` retrouve la valeur instantanément quelle que soit la taille du dictionnaire.
- **Insertion ou mise à jour dynamique** : écrire \`obligation['valeur_marche'] = ...\` crée la clé si elle n'existe pas encore, ou met à jour sa valeur si elle existe déjà.
- **Sécurité d'accès \`.get()\` vs \`[]\`** : \`d['cle_inconnue']\` lève une exception \`KeyError\` (utile pour détecter un bug de schéma), tandis que \`d.get('cle_inconnue', 0.0)\` renvoie une valeur par défaut sans planter.
- **Passage vers Pandas** : un dictionnaire représente une ligne d'observation (ou une fiche produit), et une liste de dictionnaires forme directement un \`pd.DataFrame\`.

\`\`\`python
# Exemple exécuté : fiche actif extraite de la première ligne de \`df_actifs\`
ligne_0 = df_actifs.iloc[0]
fiche = {
    'ticker': str(ligne_0['ticker']),
    'rendement_espere': float(ligne_0['rendement_espere']),
    'volatilite': float(ligne_0['volatilite']),
}
# Enrichissement dynamique avec le taux sans risque ~ 3.0% (taux_10y moyen)
rf = 0.03
fiche['exces_rendement'] = fiche['rendement_espere'] - rf
fiche['sharpe_recalcule'] = fiche['exces_rendement'] / fiche['volatilite']

print("Clés du dictionnaire :", list(fiche.keys()))
print(f"{fiche['ticker']} -> Excès rendement : {fiche['exces_rendement']:.3%} | Sharpe : {fiche['sharpe_recalcule']:.2f}")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Clés du dictionnaire : ['ticker', 'rendement_espere', 'volatilite', 'exces_rendement', 'sharpe_recalcule']
TTE -> Excès rendement : 5.500% | Sharpe : 0.25
\`\`\`

L'ajout des clés \`'exces_rendement'\` et \`'sharpe_recalcule'\` enrichit l'objet \`fiche\` sur place, exactement comme on enrichit une table ou une fiche obligataire en production.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Une obligation \`'OAT-2030'\` de nominal $10\\,000\\text{ EUR}$ verse un coupon annuel de $3.2\\%$ ($0.032$) et cote $96.5\\%$ du pair sur le marché secondaire. Calculez sa valeur de marché en euros, son coupon annuel en euros et son écart au nominal ($\\Delta_{\\text{pair}} < 0$ signifiant une décote).

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`obligation = {'ticker': 'OAT-2030', 'nominal': 10000.0, 'taux_coupon': 0.032, 'prix_marche_pct': 96.5}\`
2. Ajoutez la clé \`'valeur_marche'\` dans \`obligation\` égale à \`obligation['nominal'] * (obligation['prix_marche_pct'] / 100.0)\`
3. Calculez \`coupon_annuel = obligation['nominal'] * obligation['taux_coupon']\`
4. Calculez \`ecart_nominal = obligation['valeur_marche'] - obligation['nominal']\`
5. Affichez les résultats et le dictionnaire \`obligation\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `obligation = {
    'ticker': 'OAT-2030',
    'nominal': 10000.0,
    'taux_coupon': 0.032,
    'prix_marche_pct': 96.5,
}

obligation['valeur_marche'] = obligation['nominal'] * (obligation['prix_marche_pct'] / 100.0)
coupon_annuel = obligation['nominal'] * obligation['taux_coupon']
ecart_nominal = obligation['valeur_marche'] - obligation['nominal']

print(f"Obligation {obligation['ticker']} : valeur marché = {obligation['valeur_marche']:,.2f} EUR")
print(f"Coupon annuel : {coupon_annuel:,.2f} EUR | Écart au pair : {ecart_nominal:,.2f} EUR")`,
      testPythonCode: `assert 'obligation' in globals() and isinstance(obligation, dict), "obligation doit être un dictionnaire."
assert 'valeur_marche' in obligation, "La clé 'valeur_marche' doit être ajoutée dans obligation."
assert abs(obligation['valeur_marche'] - 9650.0) < 1e-6, "obligation['valeur_marche'] doit valoir 9650.0."
assert 'coupon_annuel' in globals() and abs(coupon_annuel - 320.0) < 1e-6, "coupon_annuel doit valoir 320.0."
assert 'ecart_nominal' in globals() and abs(ecart_nominal - (-350.0)) < 1e-6, "ecart_nominal doit valoir -350.0."
`,
      datasets: [],
      hints: [
        "Accédez aux valeurs du dictionnaire par leurs clés : obligation['nominal'], obligation['prix_marche_pct'] et obligation['taux_coupon'].",
        "Pour insérer la nouvelle clé : obligation['valeur_marche'] = obligation['nominal'] * (obligation['prix_marche_pct'] / 100.0).",
        "Vérifiez mentalement : 96.5 % de 10 000 = 9 650 EUR, donc ecart_nominal = -350.0 EUR (décote).",
      ],
      guide: {
        theoryToPracticeLink: `Chaque attribut obligataire ($N$, $c$, $P_{\\%}$) est rangé sous une clé explicite dans \`obligation\`. L'insertion dynamique \`obligation['valeur_marche'] = ...\` applique $N \\times P_{\\%}/100$ puis permet de dériver la décote $\\Delta_{\\text{pair}} = V_{\\text{marché}} - N$.`,
        stepByStepPlan: [
          "Créer le dictionnaire `obligation` avec les 4 clés initiales (`ticker`, `nominal`, `taux_coupon`, `prix_marche_pct`).",
          "Ajouter la clé `'valeur_marche'` dans `obligation`.",
          "Calculer la variable `coupon_annuel` à partir de `obligation['nominal']` et `obligation['taux_coupon']`.",
          "Calculer `ecart_nominal = obligation['valeur_marche'] - obligation['nominal']` et afficher le bilan.",
        ],
        concepts: [
          {
            symbol: "dict {k: v}",
            kind: "Syntaxe",
            roleInExercise: "Structure associative clé-valeur offrant un accès direct par nom d'attribut en $O(1)$.",
          },
          {
            symbol: "obligation['valeur_marche']",
            kind: "Variable",
            roleInExercise: "Clé ajoutée dynamiquement au dictionnaire, contenant $9\\,650.0\\text{ EUR}$.",
          },
          {
            symbol: "coupon_annuel",
            kind: "Variable",
            roleInExercise: "Flux annuel d'intérêt détaché par l'OAT ($320.0\\text{ EUR}$).",
          },
          {
            symbol: "ecart_nominal",
            kind: "Variable",
            roleInExercise: "Différence entre valeur de marché et nominal ($-350.0\\text{ EUR}$, cotation sous le pair).",
          },
          {
            symbol: "KeyError",
            kind: "Syntaxe",
            roleInExercise: "Exception levée par Python si l'on tente de lire une clé inexistante avec `[...]`.",
          },
        ],
        guidedCode: `obligation = {
    'ticker': 'OAT-2030',
    'nominal': 10000.0,
    'taux_coupon': 0.032,
    'prix_marche_pct': 96.5,
}

# 1. Enrichir le dictionnaire avec la clé 'valeur_marche'
obligation['___'] = obligation['nominal'] * (obligation['___'] / 100.0)

# 2. Calculer le coupon annuel et l'écart au nominal
coupon_annuel = obligation['nominal'] * obligation['___']
ecart_nominal = obligation['valeur_marche'] - obligation['___']

print(obligation['valeur_marche'], coupon_annuel, ecart_nominal)`,
      },
    },
    {
      id: "py-prog-5",
      title: "5. Valorisation d'Obligation par Boucle for & enumerate",
      category: "alm",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 14,
      description: "Calculez le prix théorique d'une obligation à 4 flux en parcourant sa liste de cash-flows avec une boucle for t, cf in enumerate(flux, start=1) et un accumulateur.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Somme Actualisée des Flux & Prix Théorique d'une Obligation

#### Intuition Économique & Enjeux ALM
Le **juste prix** (*fair value* ou *Mark-to-Model*) d'une obligation sans option cachée ni risque de défaut est égal à la somme des valeurs actuelles de tous ses flux futurs (coupons périodiques et remboursement du principal), actualisés au taux de rendement exigé par le marché $r$.

En ALM bancaire et assurantielle (référentiel Solvabilité II), ce calcul permet à la fois d'évaluer le portefeuille obligataire à l'actif lorsque certains titres privés sont peu liquides (*Mark-to-Model*) et de calculer la valeur *Best Estimate* des engagements garantis au passif.

#### Démonstration Mathématique Formelle
Soit une obligation versant des flux annuels $CF_1, CF_2, \\dots, CF_T$ aux dates $t = 1, \\dots, T$, actualisés au taux plat $r > -1$ :

$$P(r) = \\sum_{t=1}^T \\frac{CF_t}{(1 + r)^t} = \\sum_{t=1}^T CF_t \\cdot DF(t), \\qquad \\text{avec } DF(t) = (1 + r)^{-t}$$

où $DF(t)$ désigne le **facteur d'actualisation** (*Discount Factor*) à la maturité $t$.
- Lorsque le taux de coupon facial $c$ est **supérieur** au taux de marché $r$ ($4\\% > 3.5\\%$), le titre verse des coupons plus généreux que le marché : on obtient nécessairement $P(r) > N$ (cotation **au-dessus du pair**).
- Inversement, lorsque $r = c$, tous les flux se compensent exactement au pair : $P(c) = N$.

### 💻 Masterclass Programmation Python : Le Pattern Accumulateur & \`enumerate(flux, start=1)\`

Pour coder une somme mathématique $\\sum_{t=1}^T f(t, CF_t)$ en programmation impérative, on utilise le **pattern accumulateur** combiné à \`enumerate\` :
1. **Initialisation avant la boucle** : \`prix_obligation = 0.0\` (élément neutre de l'addition !). Si vous l'initialisez *à l'intérieur* de la boucle, il est remis à zéro à chaque itération.
2. **Pourquoi \`enumerate(flux, start=1)\` ?** : En Python, une boucle \`for cf in flux:\` donne uniquement le flux \`cf\`, pas son numéro d'année $t$. À l'inverse, \`for i in range(len(flux)):\` oblige à écrire \`flux[i]\` et démarre à \`i = 0\` (ce qui provoquerait l'erreur classique d'actualiser le premier coupon à $(1+r)^0 = 1$ au lieu de $(1+r)^1$ !). \`enumerate(flux, start=1)\` décompacte simultanément \`(t, cf)\` en démarrant exactement à \`t = 1\`.
3. **Accumulation** : \`prix_obligation += cf / ((1 + r) ** t)\` ajoute le terme courant à l'accumulateur.

\`\`\`python
# Exemple exécuté : valorisation d'une obligation 3 ans (coupons 3.0%, nominal 1000)
# au taux OAT 10 ans le plus bas (2020) vs le plus haut (2023) de \`df\`
flux_exemple = [30.0, 30.0, 1030.0]
taux_2023 = float(df['oat_10y'].max()) / 100.0  # 3.40% -> 0.034

prix_demo = 0.0
for t, cf in enumerate(flux_exemple, start=1):
    va_t = cf / ((1.0 + taux_2023) ** t)
    prix_demo += va_t
    print(f"Année t={t} | Flux = {cf:7.2f} EUR | DF = {(1+taux_2023)**(-t):.5f} | VA = {va_t:7.2f} EUR")

print(f"Prix total (r={taux_2023:.2%}) : {prix_demo:.2f} EUR")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Année t=1 | Flux =   30.00 EUR | DF = 0.96712 | VA =   29.01 EUR
Année t=2 | Flux =   30.00 EUR | DF = 0.93532 | VA =   28.06 EUR
Année t=3 | Flux = 1030.00 EUR | DF = 0.90456 | VA =  931.70 EUR
Prix total (r=3.40%) : 988.77 EUR
\`\`\`

On observe concrètement comment l'accumulateur somme les 3 valeurs actuelles successives (\`29.01 + 28.06 + 931.70 = 988.77 EUR\`) et pourquoi un coupon de $3.0\\%$ actualisé à $3.40\\%$ cote sous le pair ($988.77 < 1\\,000$).`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Une obligation de nominal $10\\,000\\text{ EUR}$ verse un coupon annuel de $4\\%$ ($400\\text{ EUR}$) pendant $4$ ans, soit l'échéancier \`[400.0, 400.0, 400.0, 10400.0]\`. Actualisez ces 4 flux au taux de marché $r = 3.5\\%$ ($0.035$) via $P = \\sum_{t=1}^4 \\frac{CF_t}{(1+r)^t}$.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`flux = [400.0, 400.0, 400.0, 10400.0]\`
2. \`r = 0.035\`
3. Initialisez \`prix_obligation = 0.0\`
4. Utilisez une boucle \`for t, cf in enumerate(flux, start=1):\` pour accumuler chaque flux actualisé dans \`prix_obligation\`
5. Affichez \`prix_obligation\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `flux = [400.0, 400.0, 400.0, 10400.0]
r = 0.035

prix_obligation = 0.0
for t, cf in enumerate(flux, start=1):
    prix_obligation += cf / ((1 + r) ** t)

print(f"Prix théorique de l'obligation (r={r:.2%}) : {prix_obligation:,.2f} EUR")`,
      testPythonCode: `assert 'flux' in globals() and flux == [400.0, 400.0, 400.0, 10400.0], "flux doit valoir [400.0, 400.0, 400.0, 10400.0]."
assert 'r' in globals() and abs(r - 0.035) < 1e-9, "r doit valoir 0.035."
attendu = sum(cf / ((1 + 0.035) ** t) for t, cf in enumerate([400.0, 400.0, 400.0, 10400.0], start=1))
assert 'prix_obligation' in globals() and abs(prix_obligation - attendu) < 1e-6, f"prix_obligation attendue ~ {attendu:.4f}."
`,
      datasets: [],
      hints: [
        "Initialisez prix_obligation = 0.0 AVANT le début de la boucle for.",
        "L'en-tête exact de la boucle est : for t, cf in enumerate(flux, start=1): afin que t prenne les valeurs 1, 2, 3, 4.",
        "À l'intérieur de la boucle, ajoutez cf / ((1 + r) ** t) à prix_obligation avec l'opérateur +=.",
      ],
      guide: {
        theoryToPracticeLink: `L'opérateur mathématique $\\sum_{t=1}^T$ se traduit littéralement par un accumulateur initialisé à \`0.0\` et une boucle \`for t, cf in enumerate(flux, start=1):\` où \`start=1\` aligne l'indice Python sur la période financière $t \\ge 1$.`,
        stepByStepPlan: [
          "Définir la liste `flux = [400.0, 400.0, 400.0, 10400.0]` et le taux `r = 0.035`.",
          "Initialiser l'accumulateur `prix_obligation = 0.0` avant la boucle.",
          "Parcourir `(t, cf)` avec `enumerate(flux, start=1)` et accumuler `cf / ((1 + r) ** t)`.",
          "Afficher le prix final (attendu : $10\\,183.65\\text{ EUR}$, supérieur au pair car $4\\% > 3.5\\%$).",
        ],
        concepts: [
          {
            symbol: "enumerate(flux, start=1)",
            kind: "Fonction / Méthode",
            roleInExercise: "Générateur produisant les couples `(t, cf)` en commençant la numérotation à `t = 1`.",
          },
          {
            symbol: "prix_obligation",
            kind: "Variable",
            roleInExercise: "Accumulateur flottant initialisé à `0.0` sommant les valeurs actuelles.",
          },
          {
            symbol: "+=",
            kind: "Syntaxe",
            roleInExercise: "Affectation augmentée équivalente à `prix_obligation = prix_obligation + ...`.",
          },
          {
            symbol: "t / cf",
            kind: "Variable",
            roleInExercise: "Variables de boucle recevant à chaque tour la maturité (`1..4`) et le flux en euros.",
          },
          {
            symbol: "r",
            kind: "Variable",
            roleInExercise: "Taux d'actualisation annuel (`0.035`).",
          },
        ],
        guidedCode: `flux = [400.0, 400.0, 400.0, 10400.0]
r = 0.035

# 1. Initialisation de l'accumulateur à l'élément neutre de l'addition
prix_obligation = ___

# 2. Boucle avec enumerate(start=1) pour aligner t sur les années 1..4
for t, cf in enumerate(___, start=___):
    prix_obligation += cf / ((1 + r) ** ___)

print(f"Prix obligation : {prix_obligation:,.2f} EUR")`,
      },
    },
    {
      id: "py-prog-6",
      title: "6. Séries de Rendements : Compteur, Produit Composé & Filtrage",
      category: "financial_econometrics",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 15,
      description: "Combinez une boucle for et une condition if sur une liste de rendements financiers pour compter les séances baissières, accumuler le rendement composé multiplicatif et extraire la liste des pertes.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Rendement Composé Multiplicatif vs Somme Arithmétique

#### Intuition Économique & Enjeux de Gestion de Portefeuille
En finance de marché, une erreur fréquente consiste à additionner naïvement des rendements simples successifs ($r_1 + r_2 + \\dots + r_T$). Or une perte de $-50\\%$ suivie d'un gain de $+50\\%$ ne ramène pas à $0\\%$, mais à $(1 - 0.50)(1 + 0.50) - 1 = -25\\%$ ! Les rendements simples se **composent multiplicativement** parce que chaque variation s'applique au capital issu de la période précédente.

Par ailleurs, distinguer la **fréquence des baisses** et isoler la queue négative des pertes (*downside returns*) permet d'évaluer l'asymétrie du risque (*hit ratio* et sévérité des pertes).

#### Démonstration Mathématique Formelle
Soit une série de rendements simples périodiques $(r_1, r_2, \\dots, r_T)$ avec $r_t > -1$. La richesse terminale par euro investi est le produit des facteurs bruts de capitalisation $(1 + r_t)$ :

$$W_T = \\prod_{t=1}^T (1 + r_t) \\implies R_{\\text{cum}} = \\left(\\prod_{t=1}^T (1 + r_t)\\right) - 1$$

Par développement du produit, $R_{\\text{cum}} = \\sum_{t=1}^T r_t + \\sum_{i < j} r_i r_j + \\dots$. En présence de volatilité, l'écart entre la moyenne arithmétique et le rendement composé est négatif (**volatility drag** : $\\approx -\\frac{1}{2}\\sigma^2$ par période), conséquence directe de l'inégalité de Jensen appliquée à la fonction concave $\\ln(1+r)$.

### 💻 Masterclass Programmation Python : Trois Accumulateurs dans une Seule Boucle \`for\`

Une seule passe \`for r in rendements:\` suffit pour piloter trois motifs algorithmiques classiques simultanément :
1. **Compteur conditionnel (\`int\`)** : initialisé à \`nb_baisses = 0\`, incrémenté par \`nb_baisses += 1\` lorsque \`if r < 0:\`.
2. **Accumulateur multiplicatif (\`float\`)** : contrairement à une somme (initialisée à \`0.0\`), un produit $\\prod$ doit être initialisé à **\`1.0\`** (l'élément neutre de la multiplication !), puis mis à jour via \`facteur_cumul *= (1 + r)\`. On soustrait \`1.0\` *après* la boucle : \`rendement_cumule = facteur_cumul - 1.0\`.
3. **Collecteur de filtrage (\`list\`)** : initialisé par une liste vide \`pertes = []\`, alimenté par \`pertes.append(r)\` dans le bloc \`if r < 0:\`.

\`\`\`python
# Illustration sur les rendements journaliers réels de \`BNP\` dans \`df_marche\`
rendements_bnp = df_marche.loc[df_marche['ticker'] == 'BNP', 'rendement_journalier'].tolist()

nb_neg = 0
facteur = 1.0
pertes_bnp = []

for r in rendements_bnp:
    facteur *= (1.0 + r)
    if r < 0.0:
        nb_neg += 1
        pertes_bnp.append(r)

r_cum_bnp = facteur - 1.0
print("Rendements BNP :", rendements_bnp)
print(f"Séances baissières : {nb_neg}/{len(rendements_bnp)} | Pertes : {pertes_bnp}")
print(f"Rendement composé : {r_cum_bnp:.4%} (vs somme arithmétique : {sum(rendements_bnp):.4%})")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Rendements BNP : [0.0048, -0.0111, 0.0097, 0.0128, -0.0047]
Séances baissières : 2/5 | Pertes : [-0.0111, -0.0047]
Rendement composé : 1.1351% (vs somme arithmétique : 1.1500%)
\`\`\`

Un seul parcours de la série suffit à calculer en $O(T)$ la statistique de baisse, la liste filtrée des pertes et le rendement géométrique exact.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Soit la série de $6$ rendements mensuels \`rendements = [0.012, -0.025, 0.008, -0.014, 0.019, -0.031]\`. Calculez le nombre de mois négatifs, isolez les rendements strictement négatifs, et déterminez le rendement cumulé composé $R_{\\text{cum}} = \\prod_{t=1}^6 (1 + r_t) - 1$ (sans confondre avec la somme arithmétique !).

**Volet 2 — Laboratoire Pratique Python :**
À l'aide d'une boucle \`for\` combinée à un \`if\`, construisez exactement :
1. \`rendements = [0.012, -0.025, 0.008, -0.014, 0.019, -0.031]\`
2. \`nb_baisses\` (\`int\`) : nombre de rendements strictement négatifs (\`r < 0\`)
3. \`rendement_cumule\` (\`float\`) : rendement composé $\\prod (1 + r_t) - 1$ (initialisez un facteur à \`1.0\` avant la boucle !)
4. \`pertes\` (\`list\`) : liste des rendements strictement négatifs ajoutés via \`.append()\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `rendements = [0.012, -0.025, 0.008, -0.014, 0.019, -0.031]

nb_baisses = 0
facteur = 1.0
pertes = []

for r in rendements:
    facteur *= (1.0 + r)
    if r < 0.0:
        nb_baisses += 1
        pertes.append(r)

rendement_cumule = facteur - 1.0

print(f"Nombre de baisses : {nb_baisses} | Pertes : {pertes}")
print(f"Rendement cumulé composé : {rendement_cumule:.4%}")`,
      testPythonCode: `assert 'rendements' in globals() and rendements == [0.012, -0.025, 0.008, -0.014, 0.019, -0.031]
assert 'nb_baisses' in globals() and nb_baisses == 3, "nb_baisses doit valoir 3."
assert 'pertes' in globals() and pertes == [-0.025, -0.014, -0.031], "pertes doit contenir [-0.025, -0.014, -0.031]."
f_att = 1.0
for _x in [0.012, -0.025, 0.008, -0.014, 0.019, -0.031]:
    f_att *= (1.0 + _x)
assert 'rendement_cumule' in globals() and abs(rendement_cumule - (f_att - 1.0)) < 1e-9, "rendement_cumule doit utiliser la composition multiplicative prod(1+r)-1, et non la somme simple."
`,
      datasets: [],
      hints: [
        "Initialisez trois variables avant la boucle : nb_baisses = 0, facteur = 1.0 (élément neutre du produit !) et pertes = [].",
        "À chaque tour de boucle, multipliez facteur *= (1.0 + r) sans condition, puis testez if r < 0.0: pour incrémenter nb_baisses et appeler pertes.append(r).",
        "Après la boucle, calculez rendement_cumule = facteur - 1.0.",
      ],
      guide: {
        theoryToPracticeLink: `Le produit mathématique $\\prod_{t=1}^T (1+r_t)$ s'implémente par un accumulateur initialisé à \`1.0\` (et non \`0.0\` !) multiplié par \`(1 + r)\` à chaque itération, tandis que \`if r < 0\` alimente simultanément le compteur \`nb_baisses\` et la liste \`pertes\`.`,
        stepByStepPlan: [
          "Définir `rendements = [0.012, -0.025, 0.008, -0.014, 0.019, -0.031]`.",
          "Initialiser `nb_baisses = 0`, `facteur = 1.0` et `pertes = []`.",
          "Parcourir `for r in rendements:` : mettre à jour `facteur *= (1.0 + r)` et, si `r < 0`, incrémenter `nb_baisses` et ajouter `r` à `pertes`.",
          "Calculer `rendement_cumule = facteur - 1.0` après la boucle.",
        ],
        concepts: [
          {
            symbol: "facteur = 1.0",
            kind: "Variable",
            roleInExercise: "Accumulateur multiplicatif initialisé à `1.0` (neutre du produit $\\prod$).",
          },
          {
            symbol: "*=",
            kind: "Syntaxe",
            roleInExercise: "Opérateur de multiplication en place (`facteur = facteur * (1 + r)`).",
          },
          {
            symbol: "nb_baisses",
            kind: "Variable",
            roleInExercise: "Compteur entier incrémenté à chaque rendement négatif (`3`).",
          },
          {
            symbol: "pertes",
            kind: "Variable",
            roleInExercise: "Liste collectant les rendements négatifs via `.append(r)`.",
          },
          {
            symbol: "rendement_cumule",
            kind: "Variable",
            roleInExercise: "Performance composée exacte $\\prod(1+r_t)-1 \\approx -3.1676\\%$.",
          },
        ],
        guidedCode: `rendements = [0.012, -0.025, 0.008, -0.014, 0.019, -0.031]

# 1. Initialisation des 3 accumulateurs
nb_baisses = 0
facteur = ___
pertes = []

# 2. Parcours de la série
for r in rendements:
    facteur *= (1.0 + ___)
    if r < ___:
        nb_baisses += ___
        pertes.___(r)

# 3. Soustraire 1 une fois le produit terminé
rendement_cumule = facteur - ___
print(nb_baisses, pertes, round(rendement_cumule, 6))`,
      },
    },
    {
      id: "py-prog-7",
      title: "7. Première Fonction Financière : Valeur Actuelle (def & return)",
      category: "alm",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 12,
      description: "Encapsulez la formule d'actualisation actuarielle dans une fonction Python réutilisable def valeur_actuelle(flux, taux, maturite) renvoyant un float via return, puis évaluez-la à 5 et 10 ans.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Actualisation d'un Engagement Unique & Sensibilité à la Maturité

#### Intuition Économique & Enjeux ALM
En assurance vie et en retraite, l'évaluation d'un passif consiste à convertir un engagement futur $CF_T$ certain (ex : un capital garanti à l'échéance $T$) en sa valeur d'aujourd'hui $V_0$, appelée **valeur actuelle** (*Present Value*, PV) ou provision mathématique économique.

Plus l'horizon $T$ est lointain, plus le facteur d'actualisation $(1+r)^{-T}$ écrase la valeur actuelle lorsque $r > 0$. Ce phénomène explique pourquoi les assureurs vie et fonds de pension ayant des passifs à 10, 20 ou 30 ans sont extrêmement sensibles aux variations des taux longs.

#### Démonstration Mathématique Formelle
Soit un flux unique $CF_T \\in \\mathbb{R}$ versé à la date $T \\ge 0$ et actualisé au taux annuel composé $r > -1$ :

$$VA(CF_T, r, T) = \\frac{CF_T}{(1 + r)^T} = CF_T (1 + r)^{-T}$$

En dérivant par rapport à la maturité $T$ (pour $CF_T > 0$ et $r > 0$), on obtient :

$$\\frac{\\partial VA}{\\partial T} = - \\ln(1 + r) \\cdot VA(CF_T, r, T) < 0$$

La valeur actuelle est donc une fonction **strictement décroissante et convexe** de la maturité $T$ : doubler la maturité de $5$ à $10$ ans applique une seconde fois le facteur d'actualisation $(1+r)^{-5}$.

### 💻 Masterclass Programmation Python : Anatomie d'une Fonction \`def\`, \`return\` vs \`print\`, & Scope Local

Créer une fonction avec \`def\` transforme un calcul ponctuel en **outil paramétrable réutilisable** sans copier-coller :
1. **Signature & Paramètres** : \`def valeur_actuelle(flux, taux, maturite):\` déclare trois paramètres locaux.
2. **Le piège fatal \`print\` vs \`return\`** : \`print(va)\` affiche un texte à l'écran mais renvoie **\`None\`** au programme appelant ! Si vous écrivez \`print(...)\` au lieu de \`return ...\`, l'expression \`va_5 + va_10\` plantera avec \`TypeError: unsupported operand type(s) for +: 'NoneType' and 'NoneType'\`. Une fonction de calcul financier doit **toujours** renvoyer sa valeur avec \`return\`.
3. **Portée (*Scope*) locale vs globale** : les variables créées à l'intérieur d'une fonction (\`flux\`, \`taux\`, \`maturite\`) n'existent que pendant son exécution (dans sa pile d'appel locale) et ne polluent pas les variables globales du notebook.
4. **Docstring** : une chaîne \`'''...'''\` juste sous \`def\` documente la fonction (\`help(valeur_actuelle)\`).

\`\`\`python
# Exemple exécuté : actualisation d'un passif de 50 000 EUR selon la courbe de \`df_taux\`
def va_zero_coupon(nominal, taux_annuel, horizon):
    '''Retourne la valeur actuelle d'un flux unique à horizon années.'''
    facteur = (1.0 + taux_annuel) ** horizon
    return nominal / facteur

# Lecture des taux OAT 5 ans et 10 ans au 2023-12-31 dans df_taux
ligne_fin = df_taux.iloc[-1]
r_5y = float(ligne_fin['taux_5y']) / 100.0
r_10y = float(ligne_fin['taux_10y']) / 100.0

pv_5y = va_zero_coupon(50_000.0, r_5y, 5)
pv_10y = va_zero_coupon(50_000.0, r_10y, 10)
print(f"Taux 2023-12-31 -> 5Y={r_5y:.2%}, 10Y={r_10y:.2%}")
print(f"VA(50 000 EUR à 5 ans) = {pv_5y:,.2f} EUR | VA(10 ans) = {pv_10y:,.2f} EUR")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Taux 2023-12-31 -> 5Y=2.50%, 10Y=2.55%
VA(50 000 EUR à 5 ans) = 44,192.71 EUR | VA(10 ans) = 38,869.89 EUR
\`\`\`

Grâce à \`return\`, la fonction \`va_zero_coupon\` peut être appelée autant de fois que souhaité sur différentes maturités et ses résultats combinés algébriquement.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Implémentez la fonction d'actualisation générale $VA(CF, r, T) = \\frac{CF}{(1 + r)^T}$ et mesurez l'effet d'allongement de la maturité sur un engagement de $10\\,000\\text{ EUR}$ actualisé à $4\\%$ sur $5$ ans puis sur $10$ ans.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. Une fonction \`def valeur_actuelle(flux, taux, maturite):\` qui **retourne** (\`return\`) \`flux / ((1 + taux) ** maturite)\`.
2. Appelez cette fonction pour stocker :
   - \`va_5 = valeur_actuelle(10000.0, 0.04, 5)\`
   - \`va_10 = valeur_actuelle(10000.0, 0.04, 10)\`
3. Affichez \`va_5\` et \`va_10\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `def valeur_actuelle(flux, taux, maturite):
    """Calcule la valeur actuelle d'un flux unique à l'horizon maturite."""
    return flux / ((1.0 + taux) ** maturite)

va_5 = valeur_actuelle(10000.0, 0.04, 5)
va_10 = valeur_actuelle(10000.0, 0.04, 10)

print(f"VA à 5 ans  : {va_5:,.2f} EUR")
print(f"VA à 10 ans : {va_10:,.2f} EUR")`,
      testPythonCode: `assert 'valeur_actuelle' in globals() and callable(valeur_actuelle), "La fonction valeur_actuelle doit être définie."
assert 'va_5' in globals() and abs(va_5 - 10000.0 / (1.04 ** 5)) < 1e-6, "va_5 incorrecte."
assert 'va_10' in globals() and abs(va_10 - 10000.0 / (1.04 ** 10)) < 1e-6, "va_10 incorrecte."
assert abs(valeur_actuelle(5000.0, 0.02, 3) - 5000.0 / (1.02 ** 3)) < 1e-6, "Votre fonction doit utiliser ses paramètres flux, taux et maturite sans coder de valeurs en dur."
`,
      datasets: [],
      hints: [
        "Déclarez la signature exacte : def valeur_actuelle(flux, taux, maturite):",
        "À l'intérieur (indenté de 4 espaces), utilisez le mot-clé return (et non print !) : return flux / ((1.0 + taux) ** maturite).",
        "En dehors de la fonction (sans indentation), appelez va_5 = valeur_actuelle(10000.0, 0.04, 5) et va_10 = valeur_actuelle(10000.0, 0.04, 10).",
      ],
      guide: {
        theoryToPracticeLink: `La formule $VA = CF_T / (1+r)^T$ devient une fonction Python réutilisable dont les trois arguments \`(flux, taux, maturite)\` paramètrent le calcul, et dont le mot-clé \`return\` restitue le nombre flottant au code appelant.`,
        stepByStepPlan: [
          "Écrire l'en-tête `def valeur_actuelle(flux, taux, maturite):`.",
          "Dans le corps indenté de la fonction, retourner `flux / ((1.0 + taux) ** maturite)`.",
          "Revenir à l'indentation 0 et appeler la fonction deux fois pour créer `va_5` et `va_10`.",
          "Afficher les deux résultats formatés.",
        ],
        concepts: [
          {
            symbol: "def ...(...):",
            kind: "Syntaxe",
            roleInExercise: "Mot-clé déclarant une nouvelle fonction et sa liste de paramètres locaux.",
          },
          {
            symbol: "return",
            kind: "Syntaxe",
            roleInExercise: "Instruction terminant la fonction et renvoyant la valeur calculée à l'appelant.",
          },
          {
            symbol: "flux, taux, maturite",
            kind: "Paramètre",
            roleInExercise: "Variables locales recevant les arguments lors de chaque appel.",
          },
          {
            symbol: "va_5 / va_10",
            kind: "Variable",
            roleInExercise: "Variables globales recevant les valeurs retournées par la fonction ($8\\,219.27$ et $6\\,755.64\\text{ EUR}$).",
          },
          {
            symbol: "Scope local",
            kind: "Syntaxe",
            roleInExercise: "Espace mémoire isolé de la fonction : les paramètres n'écrasent pas les variables extérieures.",
          },
        ],
        guidedCode: `# 1. Définition de la fonction (attention au ':' et à l'indentation)
def valeur_actuelle(flux, taux, maturite):
    ___ flux / ((1.0 + ___) ** ___)

# 2. Appels de la fonction (hors de la fonction, sans indentation)
va_5 = valeur_actuelle(10000.0, 0.04, ___)
va_10 = valeur_actuelle(10000.0, 0.04, ___)

print(f"VA 5 ans = {va_5:,.2f} EUR | VA 10 ans = {va_10:,.2f} EUR")`,
      },
    },
    {
      id: "py-prog-8",
      title: "8. Pricer Obligataire Paramétrable (Paramètre par Défaut)",
      category: "alm",
      language: "python",
      difficulty: "Débutant",
      durationMinutes: 15,
      description: "Créez une fonction pricer_obligation(flux, taux=0.03) combinant un paramètre par défaut et une boucle for + enumerate, puis vérifiez la relation inverse prix-taux entre 3 % et 5 %.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Relation Prix-Taux & Propriété du Pair Obligataire

#### Intuition Économique & Enjeux ALM
Toute variation des taux d'intérêt du marché déplace mécaniquement la valeur de marché des obligations en portefeuille en **sens inverse** : quand les taux montent, les obligations déjà émises à coupon plus faible deviennent moins attractives et leur prix baisse pour ajuster leur rendement au nouveau niveau du marché.

Un test de cohérence incontournable pour valider tout *pricer* obligataire consiste à évaluer une obligation au **taux égal à son taux facial** ($r = c$) : dans ce cas exact, la valeur actuelle de tous les coupons et du nominal doit être **rigoureusement égale au pair** ($P(c) = N$).

#### Démonstration Mathématique Formelle
Soit une obligation de nominal $N$, versant un coupon annuel $C = c N$ pendant $T$ années et remboursant $N$ en $t=T$. En dérivant $P(r) = \\sum_{t=1}^T CF_t (1+r)^{-t}$ par rapport à $r$ (avec $CF_t > 0$) :

$$\\frac{\\partial P}{\\partial r} = -\\sum_{t=1}^T t \\cdot CF_t (1 + r)^{-(t+1)} < 0$$

La dérivée première étant strictement négative, $P(r)$ est **strictement décroissante**. De plus, au point $r = c$, la somme géométrique de raison $(1+c)^{-1}$ donne :

$$P(c) = cN \\sum_{t=1}^T \\frac{1}{(1+c)^t} + \\frac{N}{(1+c)^T} = cN \\cdot \\frac{1 - (1+c)^{-T}}{c} + N(1+c)^{-T} = N$$

Cette identité algébrique sert de test unitaire d'or en salle des marchés.

### 💻 Masterclass Programmation Python : Paramètres par Défaut & Appel Positionnel / Nommé

En Python, un paramètre peut recevoir une **valeur par défaut** dans la signature de la fonction : \`def pricer_obligation(flux, taux=0.03):\`
1. **Règle d'ordre de Python** : tout paramètre avec valeur par défaut (\`taux=0.03\`) doit impérativement être placé **après** les paramètres obligatoires (\`flux\`), sinon Python lève \`SyntaxError\`.
2. **Trois façons d'appeler la fonction** :
   - \`pricer_obligation(coupons)\` $\\to$ \`taux\` prend automatiquement \`0.03\`.
   - \`pricer_obligation(coupons, 0.05)\` $\\to$ surcharge positionnelle (\`taux\` devient \`0.05\`).
   - \`pricer_obligation(coupons, taux=0.05)\` $\\to$ argument nommé (*keyword argument*), très lisible en code quantitatif.
3. **Règle d'or** : n'utilisez jamais un objet mutable (\`[]\` ou \`{}\`) comme valeur par défaut ; pour un \`float\` immuable (\`0.03\`), c'est totalement sûr.

\`\`\`python
# Exemple exécuté : impact de la remontée des taux 2y entre 2023-01 et 2023-09 (\`df_taux\`)
def pricer_demo(flux_cf, taux=0.03):
    prix = 0.0
    for t, cf in enumerate(flux_cf, start=1):
        prix += cf / ((1.0 + taux) ** t)
    return prix

oat_3pct = [30.0, 30.0, 1030.0]  # Obligation 3 ans, coupon facial 3%
r_jan = float(df_taux['taux_2y'].iloc[0]) / 100.0   # 2.70%
r_sep = float(df_taux['taux_2y'].iloc[8]) / 100.0   # 3.65%

print(f"Prix au défaut (3.00%) : {pricer_demo(oat_3pct):.2f} EUR (exactement au pair !)")
print(f"Prix en jan 2023 ({r_jan:.2%}) : {pricer_demo(oat_3pct, r_jan):.2f} EUR")
print(f"Prix en sep 2023 ({r_sep:.2%}) : {pricer_demo(oat_3pct, taux=r_sep):.2f} EUR")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Prix au défaut (3.00%) : 1000.00 EUR (exactement au pair !)
Prix en jan 2023 (2.70%) : 1008.54 EUR
Prix en sep 2023 (3.65%) : 981.84 EUR
\`\`\`

Le test au taux facial $3.00\\%$ renvoie exactement \`1000.00 EUR\` (le pair), et le passage du taux de $2.70\\%$ à $3.65\\%$ illustre la perte de valeur obligataire lors du resserrement monétaire de 2023.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Soit l'obligation 4 ans au coupon facial de $5\\%$ (nominal $1\\,000\\text{ EUR}$), soit \`coupons = [50.0, 50.0, 50.0, 1050.0]\`. Comparez sa valorisation au taux par défaut $3\\%$ (au-dessus du pair) et au taux de $5\\%$ (exactement au pair : $1\\,000.00\\text{ EUR}$).

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`def pricer_obligation(flux, taux=0.03):\` calculant et retournant la somme actualisée de \`flux\` via une boucle \`for\` + \`enumerate(..., start=1)\`.
2. \`coupons = [50.0, 50.0, 50.0, 1050.0]\`
3. \`prix_3pct = pricer_obligation(coupons)\` (en utilisant le paramètre par défaut sans passer \`taux\` !)
4. \`prix_5pct = pricer_obligation(coupons, 0.05)\`
5. Affichez \`prix_3pct\` et \`prix_5pct\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `def pricer_obligation(flux, taux=0.03):
    """Actualise une liste de flux annuels au taux d'actualisation donné."""
    prix = 0.0
    for t, cf in enumerate(flux, start=1):
        prix += cf / ((1.0 + taux) ** t)
    return prix

coupons = [50.0, 50.0, 50.0, 1050.0]
prix_3pct = pricer_obligation(coupons)
prix_5pct = pricer_obligation(coupons, 0.05)

print(f"Prix à 3% (défaut) : {prix_3pct:,.2f} EUR")
print(f"Prix à 5% (pair)   : {prix_5pct:,.2f} EUR")`,
      testPythonCode: `assert 'pricer_obligation' in globals() and callable(pricer_obligation), "La fonction pricer_obligation doit être définie."
assert 'prix_3pct' in globals() and abs(pricer_obligation([50.0, 50.0, 50.0, 1050.0]) - prix_3pct) < 1e-9, "pricer_obligation(coupons) doit fonctionner avec un seul argument (paramètre par défaut taux=0.03)."
assert abs(prix_3pct - 1074.341969) < 1e-3, "prix_3pct incorrecte."
assert 'prix_5pct' in globals() and abs(prix_5pct - 1000.0) < 1e-6, "prix_5pct doit valoir exactement 1000.0 EUR (au pair)."
assert abs(pricer_obligation([100.0, 1100.0], 0.04) - (100/1.04 + 1100/1.04**2)) < 1e-6, "La fonction doit être générique pour toute liste de flux."
`,
      datasets: [],
      hints: [
        "Spécifiez la valeur par défaut directement dans la signature : def pricer_obligation(flux, taux=0.03):",
        "Dans la fonction, initialisez prix = 0.0, bouclez avec for t, cf in enumerate(flux, start=1):, accumulez cf / ((1.0 + taux) ** t), puis return prix.",
        "Appelez ensuite pricer_obligation(coupons) avec un seul argument pour tester le défaut 0.03, puis pricer_obligation(coupons, 0.05).",
      ],
      guide: {
        theoryToPracticeLink: `Nous combinons le motif d'actualisation $\\sum_{t=1}^T CF_t/(1+r)^t$ (boucle \`enumerate\`) avec une signature à paramètre par défaut \`taux=0.03\`. Lorsque l'argument \`taux\` vaut \`0.05\` (égal au coupon facial), la fonction vérifie l'identité $P(c) = N = 1\\,000.0\\text{ EUR}$.`,
        stepByStepPlan: [
          "Définir `def pricer_obligation(flux, taux=0.03):` avec `0.03` comme valeur par défaut.",
          "Dans le corps, initialiser `prix = 0.0`, itérer `for t, cf in enumerate(flux, start=1):` et accumuler `cf / ((1.0 + taux) ** t)`.",
          "Retourner `prix` avec `return prix`.",
          "Définir `coupons = [50.0, 50.0, 50.0, 1050.0]`, puis calculer `prix_3pct` (1 argument) et `prix_5pct` (2 arguments).",
        ],
        concepts: [
          {
            symbol: "taux=0.03",
            kind: "Paramètre",
            roleInExercise: "Paramètre par défaut utilisé automatiquement si le second argument est omis lors de l'appel.",
          },
          {
            symbol: "pricer_obligation",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction générique valorisant n'importe quel échéancier de flux annuels.",
          },
          {
            symbol: "enumerate(flux, start=1)",
            kind: "Fonction / Méthode",
            roleInExercise: "Associe chaque flux `cf` à sa maturité exacte `t = 1, 2, 3, 4`.",
          },
          {
            symbol: "prix_3pct",
            kind: "Variable",
            roleInExercise: "Prix de l'obligation à $3\\%$ ($1\\,074.34\\text{ EUR}$, au-dessus du pair).",
          },
          {
            symbol: "prix_5pct",
            kind: "Variable",
            roleInExercise: "Prix de l'obligation à $5\\%$ ($1\\,000.00\\text{ EUR}$, au pair).",
          },
        ],
        guidedCode: `def pricer_obligation(flux, taux=___):
    prix = 0.0
    for t, cf in enumerate(___, start=1):
        prix += cf / ((1.0 + ___) ** t)
    return ___

coupons = [50.0, 50.0, 50.0, 1050.0]
prix_3pct = pricer_obligation(___)        # utilise taux=0.03 par défaut
prix_5pct = pricer_obligation(___, 0.05)  # surcharge le taux à 0.05

print(f"3% : {prix_3pct:,.2f} EUR | 5% : {prix_5pct:,.2f} EUR")`,
      },
    },
    {
      id: "py-prog-9",
      title: "9. Estimateurs Statistiques Sans Biais & Retour Multiple (Tuple)",
      category: "econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 16,
      description: "Écrivez une fonction pure Python stats_rendements(liste_r) sans NumPy qui calcule la moyenne empirique et l'écart-type corrigé (n - 1) via math.sqrt, puis décompactez le tuple (moy_r, vol_r).",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Correction de Bessel ($n - 1$) & Estimation de la Volatilité

#### Intuition Économique & Enjeux Économétriques
Dans tout reporting de gestion d'actifs ou calcul de Value-at-Risk (VaR) paramétrique, on cherche à estimer simultanément le rendement moyen $\\mu$ et la volatilité $\\sigma$ à partir d'un échantillon historique fini de $n$ observations $(r_1, \\dots, r_n)$ (par exemple 6 mois ou 16 trimestres).

Or la vraie moyenne théorique $\\mu$ est inconnue et doit elle-même être estimée par $\\bar{r}$. Parce que $\\bar{r}$ minimise précisément la somme des carrés des écarts $\\sum_{i=1}^n (r_i - m)^2$, mesurer la dispersion autour de $\\bar{r}$ plutôt qu'autour de $\\mu$ **sous-estime systématiquement** la variance réelle si l'on divise par $n$ ! Sur des séries financières courtes ($n = 6$ ou $n = 12$), oublier la **correction de Bessel** ($n - 1$) sous-évalue le risque du portefeuille.

#### Démonstration Mathématique Formelle
Soient $R_1, \\dots, R_n$ des variables aléatoires i.i.d. d'espérance $\\mu$ et de variance $\\sigma^2 < \\infty$, et soit $\\bar{R} = \\frac{1}{n}\\sum_{i=1}^n R_i$ dont la variance vaut $\\operatorname{Var}(\\bar{R}) = \\frac{\\sigma^2}{n}$. Décomposons :

$$\\sum_{i=1}^n (R_i - \\mu)^2 = \\sum_{i=1}^n \\left((R_i - \\bar{R}) + (\\bar{R} - \\mu)\\right)^2 = \\sum_{i=1}^n (R_i - \\bar{R})^2 + n(\\bar{R} - \\mu)^2$$

En prenant l'espérance de part et d'autre, sachant que $\\mathbb{E}[(R_i - \\mu)^2] = \\sigma^2$ et $\\mathbb{E}[(\\bar{R} - \\mu)^2] = \\operatorname{Var}(\\bar{R}) = \\frac{\\sigma^2}{n}$ :

$$n \\sigma^2 = \\mathbb{E}\\!\\left[\\sum_{i=1}^n (R_i - \\bar{R})^2\\right] + n \\cdot \\frac{\\sigma^2}{n} \\implies \\mathbb{E}\\!\\left[\\sum_{i=1}^n (R_i - \\bar{R})^2\\right] = (n - 1)\\sigma^2$$

L'estimateur **sans biais** de la variance (et sa racine carrée pour la volatilité) divise donc obligatoirement par $n - 1$ (degrés de liberté) :

$$\\hat{s}^2 = \\frac{1}{n - 1} \\sum_{i=1}^n (r_i - \\bar{r})^2, \\qquad \\hat{\\sigma} = \\sqrt{\\hat{s}^2}$$

### 💻 Masterclass Programmation Python : Algorithme Deux Passes, \`math.sqrt\` & Retour Multiple (\`tuple\`)

Une fonction Python peut renvoyer **plusieurs valeurs simultanément** en les séparant par des virgules : \`return moy, vol\` retourne en réalité un \`tuple\` de taille 2 que le code appelant décompacte directement par \`moy_r, vol_r = stats_rendements(...)\`.
- **Algorithme en deux passes en pur Python** :
  1. Passe 1 : calculer \`n = len(liste_r)\` et la moyenne \`moy = sum(liste_r) / n\`.
  2. Passe 2 : accumuler \`somme_carres = 0.0\` avec \`for r in liste_r: somme_carres += (r - moy) ** 2\`.
  3. Variance et écart-type : \`var = somme_carres / (n - 1)\` puis \`vol = math.sqrt(var)\`.
- Pourquoi éviter \`sum(r**2)/n - moy**2\` (formule naïve en une passe) ? Car sur des rendements proches d'une constante élevée, la soustraction de deux grands carrés presque égaux provoque une **annulation catastrophique** en virgule flottante IEEE-754. La méthode centrée en deux passes est numériquement stable !

\`\`\`python
import math

def stats_sans_biais(serie):
    '''Retourne (moyenne, ecart_type_n_moins_1) en pur Python.'''
    n = len(serie)
    moy = sum(serie) / n
    somme_ecarts_carres = 0.0
    for x in serie:
        somme_ecarts_carres += (x - moy) ** 2
    vol = math.sqrt(somme_ecarts_carres / (n - 1))
    return moy, vol

# Test sur les 16 rendements trimestriels du CAC 40 dans \`df\`
cac_r = df['cac40_rendement'].tolist()
moy_cac, vol_cac = stats_sans_biais(cac_r)
vol_biaisee = math.sqrt(sum((x - moy_cac) ** 2 for x in cac_r) / len(cac_r))

print(f"CAC 40 (n={len(cac_r)}) -> Moyenne : {moy_cac:.3f}% | Volatilité (n-1) : {vol_cac:.4f}%")
print(f"Comparaison biaisée (divisée par n) : {vol_biaisee:.4f}% (sous-estime le risque !)")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
CAC 40 (n=16) -> Moyenne : 1.994% | Volatilité (n-1) : 11.0229%
Comparaison biaisée (divisée par n) : 10.6728% (sous-estime le risque !)
\`\`\`

La volatilité sans biais ($11.02\\%$) est supérieure à l'estimateur biaisé divisé par $n$ ($10.67\\%$) : sur $16$ trimestres, corriger par $n-1$ évite une sous-estimation de $35$ points de base.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Implémentez en pur Python (sans NumPy ni Pandas) les estimateurs de moyenne $\\bar{r} = \\frac{1}{n}\\sum_{i=1}^n r_i$ et d'écart-type corrigé $\\hat{\\sigma} = \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^n (r_i - \\bar{r})^2}$ avec \`math.sqrt\`.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. Importez \`math\` et écrivez \`def stats_rendements(liste_r):\` qui calcule \`moy\` et \`vol\` (avec dénominateur \`n - 1\`) en pur Python et retourne le tuple \`(moy, vol)\`.
2. Définissez \`rendements = [0.012, -0.025, 0.008, -0.014, 0.019, -0.031]\`
3. Décompactez le retour de la fonction dans deux variables : \`moy_r, vol_r = stats_rendements(rendements)\`
4. Affichez \`moy_r\` et \`vol_r\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `import math

def stats_rendements(liste_r):
    """Retourne (moyenne, volatilité sans biais n-1) d'une liste de rendements."""
    n = len(liste_r)
    moy = sum(liste_r) / n
    somme_carres = 0.0
    for r in liste_r:
        somme_carres += (r - moy) ** 2
    vol = math.sqrt(somme_carres / (n - 1))
    return moy, vol

rendements = [0.012, -0.025, 0.008, -0.014, 0.019, -0.031]
moy_r, vol_r = stats_rendements(rendements)

print(f"Moyenne : {moy_r:.4%} | Volatilité (n-1) : {vol_r:.4%}")`,
      testPythonCode: `import math
assert 'stats_rendements' in globals() and callable(stats_rendements), "La fonction stats_rendements doit être définie."
res_test = stats_rendements([0.02, 0.04, 0.06])
assert isinstance(res_test, tuple) and len(res_test) == 2, "stats_rendements doit retourner un tuple de 2 éléments (moy, vol)."
assert abs(res_test[0] - 0.04) < 1e-9, "La moyenne retournée est incorrecte."
assert abs(res_test[1] - 0.02) < 1e-9, "L'écart-type doit utiliser n - 1 (Bessel) : pour [0.02, 0.04, 0.06], vol vaut 0.02 et non 0.01633."
assert 'moy_r' in globals() and 'vol_r' in globals(), "Décompactez moy_r, vol_r = stats_rendements(rendements)."
att_m = sum([0.012, -0.025, 0.008, -0.014, 0.019, -0.031]) / 6
att_v = math.sqrt(sum((x - att_m) ** 2 for x in [0.012, -0.025, 0.008, -0.014, 0.019, -0.031]) / 5)
assert abs(moy_r - att_m) < 1e-9 and abs(vol_r - att_v) < 1e-9, "Valeurs de moy_r ou vol_r incorrectes."
`,
      datasets: [],
      hints: [
        "Importez math en haut du script, calculez n = len(liste_r) puis moy = sum(liste_r) / n.",
        "Utilisez une boucle for r in liste_r: pour sommer (r - moy) ** 2, puis divisez cette somme par (n - 1) avant d'appliquer math.sqrt(...).",
        "Terminez par return moy, vol et décompactez : moy_r, vol_r = stats_rendements(rendements).",
      ],
      guide: {
        theoryToPracticeLink: `La fonction effectue deux passes sur \`liste_r\` : calcul de $\\bar{r}$, puis somme des carrés centrés $\\sum (r_i - \\bar{r})^2$ divisée par le nombre exact de degrés de liberté \`n - 1\`. Le retour \`return moy, vol\` produit un tuple directement décompactable.`,
        stepByStepPlan: [
          "Importer le module standard `math`.",
          "Définir `def stats_rendements(liste_r):`, calculer `n = len(liste_r)` et `moy = sum(liste_r) / n`.",
          "Accumuler `somme_carres += (r - moy) ** 2` dans une boucle `for`, puis calculer `vol = math.sqrt(somme_carres / (n - 1))`.",
          "Retourner `moy, vol` et décompacter `moy_r, vol_r = stats_rendements(rendements)`.",
        ],
        concepts: [
          {
            symbol: "return moy, vol",
            kind: "Syntaxe",
            roleInExercise: "Retourne un tuple de deux valeurs sans nécessiter de parenthèses obligatoires.",
          },
          {
            symbol: "moy_r, vol_r = ...",
            kind: "Syntaxe",
            roleInExercise: "Décompactage (*tuple unpacking*) affectant simultanément deux variables.",
          },
          {
            symbol: "n - 1",
            kind: "Paramètre",
            roleInExercise: "Degrés de liberté (correction de Bessel) éliminant le biais de sous-estimation de la variance.",
          },
          {
            symbol: "math.sqrt(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction de la bibliothèque standard calculant la racine carrée d'un flottant.",
          },
          {
            symbol: "stats_rendements",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction pure Python indépendante de NumPy calculant moyenne et volatilité.",
          },
        ],
        guidedCode: `import math

def stats_rendements(liste_r):
    n = len(liste_r)
    moy = sum(liste_r) / ___
    somme_carres = 0.0
    for r in liste_r:
        somme_carres += (r - ___) ** 2
    vol = math.sqrt(somme_carres / (___ - 1))
    return ___, ___

rendements = [0.012, -0.025, 0.008, -0.014, 0.019, -0.031]
moy_r, vol_r = stats_rendements(___)
print(moy_r, vol_r)`,
      },
    },
    {
      id: "py-prog-10",
      title: "10. Programmation Défensive : Garde-Fou sur le Ratio S/P",
      category: "pricing",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 16,
      description: "Écrivez une fonction analyser_sp(primes, sinistres) dotée d'une clause de garde (early return) protégeant contre une somme de primes nulle (ZeroDivisionError), puis testez-la sur un portefeuille réel et un cas dégénéré.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Agrégation de Portefeuille & Gestion des Segments Dégénérés

#### Intuition Économique & Enjeux de Direction Technique
Dans un moteur de tarification ou de suivi technique automatisé, les données d'entrée proviennent de requêtes ou de lots mensuels filtrés par produit, canal ou cohorte. Il arrive fréquemment qu'un segment fraîchement lancé, un produit annulé ou une maille vide présente une masse de primes acquises nulle ($\\sum P_i = 0$) alors que des provisions ou ajustements résiduels existent encore au numérateur.

Un pipeline analytique robuste ne doit **jamais planter** avec une erreur fatale (\`ZeroDivisionError\`) ni laisser passer silencieusement un \`NaN\` / \`inf\` dans un tableau de bord comité de direction : il doit détecter le cas dégénéré en amont et renvoyer un code d'erreur explicite.

#### Démonstration Mathématique Formelle
Soient deux vecteurs de montants positifs ou nuls $\\mathbf{P} = (P_1, \\dots, P_m) \\in \\mathbb{R}_+^m$ et $\\mathbf{S} = (S_1, \\dots, S_k) \\in \\mathbb{R}_+^k$. Le ratio global $S/P$ est défini sur le domaine $\\mathcal{D} = \\{ \\mathbf{P} : \\sum_{i=1}^m P_i > 0 \\}$ par :

$$S/P(\\mathbf{P}, \\mathbf{S}) = \\frac{\\sum_{j=1}^k S_j}{\\sum_{i=1}^m P_i} \\in [0, +\\infty[$$

On prolonge l'application en une fonction totale sécurisée renvoyant un couple \`(ratio, statut)\` :

$$\\Phi(\\mathbf{P}, \\mathbf{S}) = \\begin{cases} (0.0,\\ \\text{"Erreur: primes nulles"}) & \\text{si } \\sum P_i = 0 \\\\ \\big(S/P(\\mathbf{P}, \\mathbf{S}),\\ \\text{verdict}(S/P)\\big) & \\text{si } \\sum P_i > 0 \\end{cases}$$

### 💻 Masterclass Programmation Python : Clauses de Garde (*Guard Clauses*) & *Early Return*

La **programmation défensive** consiste à vérifier les préconditions critiques dès les premières lignes d'une fonction :
1. **Clause de garde (\`early return\`)** :
   \`\`\`python
   total_primes = sum(primes)
   if total_primes == 0:
       return (0.0, 'Erreur: primes nulles')
   \`\`\`
   Dès que \`return\` est exécuté, la fonction s'interrompt immédiatement : la division \`total_sinistres / total_primes\` qui suit n'est **jamais atteinte** lorsque \`total_primes == 0\`.
2. **Code plat et lisible** : contrairement à un gros bloc \`if total_primes != 0: ... else: ...\` qui indente inutilement toute la logique métier, la clause de garde garde le flux principal au niveau d'indentation minimal (*flatten the arrow*).
3. **Homogénéité du type de retour** : la fonction retourne systématiquement un tuple \`(float, str)\`, même en cas d'erreur, ce qui permet au code appelant de toujours décompacter \`ratio, verdict = analyser_sp(...)\` sans crash de type.

\`\`\`python
# Exemple exécuté sur la région Bretagne (0 sinistre) et un segment vide simulé
def demo_analyse_segment(primes, sinistres):
    tot_p = sum(primes)
    if tot_p == 0:
        return (0.0, 'Erreur: primes nulles')
    tot_s = sum(sinistres)
    ratio = tot_s / tot_p
    if ratio < 0.70:
        statut = "Rentable"
    elif ratio <= 1.00:
        statut = "Sous surveillance"
    else:
        statut = "Déficitaire"
    return (ratio, statut)

# Cas 1 : segment PACA extrait de df_assures / df_sinistres
primes_paca = df_assures.loc[df_assures['region'] == 'PACA', 'prime_annuelle'].tolist()
paca_ids = set(df_assures.loc[df_assures['region'] == 'PACA', 'police_id'])
sin_paca = df_sinistres.loc[df_sinistres['police_id'].isin(paca_ids), 'cout_total'].tolist()

print("PACA :", demo_analyse_segment(primes_paca, sin_paca))
print("Bretagne (0 sinistre) :", demo_analyse_segment([490.0], []))
print("Segment sans primes   :", demo_analyse_segment([0.0, 0.0], [350.0]))
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
PACA : (4.71304347826087, 'Déficitaire')
Bretagne (0 sinistre) : (0.0, 'Rentable')
Segment sans primes   : (0.0, 'Erreur: primes nulles')
\`\`\`

Le cas dégénéré \`[0.0, 0.0]\` renvoie proprement \`(0.0, 'Erreur: primes nulles')\` au lieu de provoquer une \`ZeroDivisionError\`.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Créez une fonction robuste calculant le ratio décimal $S/P = \\frac{\\sum \\text{sinistres}}{\\sum \\text{primes}}$ (ex : \`0.84\` pour $84\\%$), protégée par un garde-fou si $\\sum \\text{primes} == 0$, et classifiant le segment selon :
- \`ratio_sp < 0.70\` $\\implies$ \`'Rentable'\`
- \`0.70 <= ratio_sp <= 1.00\` $\\implies$ \`'Sous surveillance'\`
- \`ratio_sp > 1.00\` $\\implies$ \`'Déficitaire'\`

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`def analyser_sp(primes, sinistres):\`
   - Si \`sum(primes) == 0\`, retourne immédiatement \`(0.0, 'Erreur: primes nulles')\`.
   - Sinon calcule \`ratio_sp = sum(sinistres) / sum(primes)\`, détermine \`verdict\` (\`'Rentable'\`, \`'Sous surveillance'\`, ou \`'Déficitaire'\`) et retourne \`(ratio_sp, verdict)\`.
2. Testez votre fonction sur les listes \`[500, 800, 1200]\` et \`[0, 400, 1700]\` en stockant le résultat dans \`sp_test, verdict_test = analyser_sp([500, 800, 1200], [0, 400, 1700])\`.
3. Testez également \`res_nul = analyser_sp([0, 0], [100, 200])\` et affichez les résultats.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `def analyser_sp(primes, sinistres):
    """Calcule le ratio S/P et le verdict avec garde-fou contre primes nulles."""
    total_primes = sum(primes)
    if total_primes == 0:
        return (0.0, 'Erreur: primes nulles')

    ratio_sp = sum(sinistres) / total_primes
    if ratio_sp < 0.70:
        verdict = 'Rentable'
    elif ratio_sp <= 1.00:
        verdict = 'Sous surveillance'
    else:
        verdict = 'Déficitaire'

    return (ratio_sp, verdict)

sp_test, verdict_test = analyser_sp([500, 800, 1200], [0, 400, 1700])
res_nul = analyser_sp([0, 0], [100, 200])

print(f"Portefeuille test : S/P = {sp_test:.2%} | Verdict = {verdict_test}")
print("Cas primes nulles :", res_nul)`,
      testPythonCode: `assert 'analyser_sp' in globals() and callable(analyser_sp), "La fonction analyser_sp doit être définie."
assert analyser_sp([0, 0], [100, 200]) == (0.0, 'Erreur: primes nulles'), "Garde-fou défaillant pour primes nulles."
assert analyser_sp([], []) == (0.0, 'Erreur: primes nulles'), "Garde-fou défaillant pour listes vides."
assert 'sp_test' in globals() and 'verdict_test' in globals(), "Stockez le test dans sp_test, verdict_test."
assert abs(sp_test - 0.84) < 1e-9 and verdict_test == 'Sous surveillance', "Résultat attendu : (0.84, 'Sous surveillance')."
r_ok, v_ok = analyser_sp([1000], [500])
assert abs(r_ok - 0.5) < 1e-9 and v_ok == 'Rentable', "Cas rentable incorrect."
r_ko, v_ko = analyser_sp([1000], [1250])
assert abs(r_ko - 1.25) < 1e-9 and v_ko == 'Déficitaire', "Cas déficitaire incorrect."
`,
      datasets: [],
      hints: [
        "Calculez d'abord total_primes = sum(primes) et écrivez tout de suite : if total_primes == 0: return (0.0, 'Erreur: primes nulles').",
        "Après cette clause de garde, vous pouvez diviser sans danger : ratio_sp = sum(sinistres) / total_primes.",
        "Affectez verdict via if / elif / else avec les seuils 0.70 et 1.00, puis terminez par return (ratio_sp, verdict).",
      ],
      guide: {
        theoryToPracticeLink: `La clause de garde \`if sum(primes) == 0: return (0.0, 'Erreur: primes nulles')\` implémente le prolongement de sécurité de la fonction mathématique hors du domaine $\\sum P_i = 0$ en conservant un type de retour homogène \`(float, str)\`.`,
        stepByStepPlan: [
          "Définir `def analyser_sp(primes, sinistres):` et calculer `total_primes = sum(primes)`.",
          "Ajouter la clause de garde `if total_primes == 0: return (0.0, 'Erreur: primes nulles')`.",
          "Calculer `ratio_sp = sum(sinistres) / total_primes` et classer `verdict` (`'Rentable'`, `'Sous surveillance'`, `'Déficitaire'`).",
          "Retourner `(ratio_sp, verdict)`, puis tester la fonction sur `[500, 800, 1200]` / `[0, 400, 1700]` et sur le cas nul.",
        ],
        concepts: [
          {
            symbol: "Clause de garde (early return)",
            kind: "Syntaxe",
            roleInExercise: "Vérification en tête de fonction qui interrompt l'exécution avant toute division par zéro.",
          },
          {
            symbol: "analyser_sp",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction prenant deux listes de flux et retournant toujours un couple `(ratio, statut)`.",
          },
          {
            symbol: "sum(primes)",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule la masse totale des primes quelle que soit la taille de la liste.",
          },
          {
            symbol: "sp_test, verdict_test",
            kind: "Variable",
            roleInExercise: "Variables décompactées recevant `0.84` et `'Sous surveillance'`.",
          },
          {
            symbol: "ZeroDivisionError",
            kind: "Syntaxe",
            roleInExercise: "Exception Python évitée grâce au garde-fou `total_primes == 0`.",
          },
        ],
        guidedCode: `def analyser_sp(primes, sinistres):
    total_primes = sum(primes)
    # 1. Clause de garde (early return)
    if total_primes == ___:
        return (0.0, 'Erreur: primes nulles')

    # 2. Calcul sécurisé et classification
    ratio_sp = sum(sinistres) / ___
    if ratio_sp < 0.70:
        verdict = 'Rentable'
    elif ratio_sp <= 1.00:
        verdict = 'Sous surveillance'
    else:
        verdict = 'Déficitaire'

    return (___, ___)

sp_test, verdict_test = analyser_sp([500, 800, 1200], [0, 400, 1700])
res_nul = analyser_sp([0, 0], [100, 200])
print(sp_test, verdict_test, res_nul)`,
      },
    },
    {
      id: "py-prog-11",
      title: "11. Moteur de Bonus-Malus Borné & Simulation Multi-Années",
      category: "pricing",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 16,
      description: "Codez la fonction bornée ajuster_crm(crm_actuel, nb_sinistres) (réduction 0.95 ou majoration 1.25^k, bornée dans [0.50, 3.50] via min/max) puis simulez 5 années sans sinistre depuis crm = 1.0.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Chaîne de Markov du Bonus-Malus (CRM) & Bornes Réglementaires

#### Intuition Économique & Enjeux Actuariels Auto
En assurance automobile française, le **Coefficient de Réduction-Majoration (CRM)** ajuste chaque année la prime de référence selon l'historique individuel de sinistres responsables (*tarification a posteriori* / théorie de la crédibilité).
- Une année sans sinistre responsable réduit le CRM de $5\\%$ ($\\times 0.95$).
- Chaque sinistre responsable multiplie le CRM par $1.25$ (soit $\\times 1.25^k$ pour $k$ sinistres dans l'année).
- Pour préserver la mutualisation du risque et éviter des primes prohibitives ou nulles, la réglementation impose un **plancher** à $0.50$ (bonus maximal de $50\\%$) et un **plafond** à $3.50$ (malus maximal de $350\\%$).

#### Démonstration Mathématique Formelle
L'évolution du coefficient $C_t \\in [0.50, 3.50]$ d'une année sur l'autre suit une **chaîne de Markov bornée** :

$$C_{t+1} = \\min\\!\\Big(3.50,\\ \\max\\!\\big(0.50,\\ C_t \\cdot \\phi(N_{t+1})\\big)\\Big), \\qquad \\phi(k) = \\begin{cases} 0.95 & \\text{si } k = 0 \\\\ 1.25^k & \\text{si } k \\ge 1 \\end{cases}$$

Sans sinistre depuis $C_0 = 1.0$ pendant $T$ années consécutives (avant d'atteindre le plancher $0.50$), on obtient $C_T = 0.95^T$. Le nombre minimal d'années sans sinistre pour toucher le bonus maximal de $0.50$ vérifie :

$$0.95^T \\le 0.50 \\iff T \\ge \\frac{\\ln(0.50)}{\\ln(0.95)} \\approx 13.51 \\implies T = 14\\text{ ans}$$

Au bout de $5$ ans sans sinistre depuis $1.0$, le CRM atteint $0.95^5 \\approx 0.7738$.

### 💻 Masterclass Programmation Python : Bornage (\`min\`/\`max\`), Appel Itératif & Variable \`_\`

1. **Bornage élégant (*clamping*) en une ligne** :
   En Python, pour contraindre \`val\` dans $[0.50, 3.50]$, on imbrique \`min(3.50, max(0.50, val))\` :
   - \`max(0.50, val)\` remonte toute valeur $< 0.50$ au plancher \`0.50\`.
   - \`min(3.50, ...)\` rabaisse toute valeur $> 3.50$ au plafond \`3.50\`.
   C'est plus compact et moins source d'erreurs que deux blocs \`if/elif\`.
2. **Simulation récurrente par boucle \`for _ in range(5):\`** :
   Quand l'indice de boucle n'est pas utilisé dans le calcul, la convention Python PEP 8 utilise le nom \`_\` (variable muette) pour signaler au lecteur que l'on répète simplement l'action 5 fois : \`crm_final = ajuster_crm(crm_final, 0)\`.

\`\`\`python
# Illustration : trajectoires de CRM sur deux profils contrastés sur 6 ans
def simuler_crm_demo(crm_init, sinistres_annuels):
    crm = crm_init
    historique = [crm]
    for nb_sin in sinistres_annuels:
        brut = crm * 0.95 if nb_sin == 0 else crm * (1.25 ** nb_sin)
        crm = min(3.50, max(0.50, brut))
        historique.append(round(crm, 4))
    return historique

print("Bon conducteur (0 sinistre, départ 0.60) :", simuler_crm_demo(0.60, [0, 0, 0, 0, 0, 0]))
print("Conducteur sinistré (départ 2.00)        :", simuler_crm_demo(2.00, [1, 2, 0, 1, 0, 0]))
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Bon conducteur (0 sinistre, départ 0.60) : [0.6, 0.57, 0.5415, 0.5144, 0.5, 0.5, 0.5]
Conducteur sinistré (départ 2.00)        : [2.0, 2.5, 3.5, 3.325, 3.5, 3.325, 3.1587]
\`\`\`

On observe clairement les deux effets de butée : le bon conducteur plafonne au plancher \`0.50\` dès la 4e année ($0.60 \\times 0.95^4 = 0.4887 \\to 0.50$), tandis que le conducteur sinistré bute sur le plafond légal \`3.50\` après deux sinistres.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Implémentez la règle d'actualisation du CRM :
- Si \`nb_sinistres == 0\` $\\implies$ multiplier le CRM par $0.95$.
- Sinon (\`nb_sinistres > 0\`) $\\implies$ multiplier le CRM par $1.25^{\\text{nb\\_sinistres}}$.
- Borner systématiquement le résultat dans $[0.50, 3.50]$.
Puis simulez l'évolution d'un jeune conducteur partant de \`crm = 1.0\` sur $5$ années consécutives sans sinistre.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`def ajuster_crm(crm_actuel, nb_sinistres):\` appliquant la règle ci-dessus et bornant avec \`min(3.50, max(0.50, ...))\`.
2. Initialisez \`crm_final = 1.0\`, puis utilisez une boucle \`for\` de 5 itérations appelant \`crm_final = ajuster_crm(crm_final, 0)\`.
3. Affichez \`crm_final\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `def ajuster_crm(crm_actuel, nb_sinistres):
    """Met à jour le coefficient Bonus-Malus et le borne dans [0.50, 3.50]."""
    if nb_sinistres == 0:
        nouveau_crm = crm_actuel * 0.95
    else:
        nouveau_crm = crm_actuel * (1.25 ** nb_sinistres)
    return min(3.50, max(0.50, nouveau_crm))

crm_final = 1.0
for _ in range(5):
    crm_final = ajuster_crm(crm_final, 0)

print(f"CRM après 5 ans sans sinistre (départ 1.00) : {crm_final:.4f}")`,
      testPythonCode: `assert 'ajuster_crm' in globals() and callable(ajuster_crm), "La fonction ajuster_crm doit être définie."
assert abs(ajuster_crm(0.51, 0) - 0.50) < 1e-9, "Le plancher 0.50 n'est pas respecté (ajuster_crm(0.51, 0) doit valoir 0.50)."
assert abs(ajuster_crm(3.0, 2) - 3.50) < 1e-9, "Le plafond 3.50 n'est pas respecté (ajuster_crm(3.0, 2) doit valoir 3.50)."
assert abs(ajuster_crm(1.0, 1) - 1.25) < 1e-9, "1 sinistre depuis 1.0 doit donner 1.25."
assert abs(ajuster_crm(1.0, 2) - 1.5625) < 1e-9, "2 sinistres depuis 1.0 doivent donner 1.25**2 = 1.5625."
assert 'crm_final' in globals() and abs(crm_final - (0.95 ** 5)) < 1e-9, "crm_final après 5 ans sans sinistre depuis 1.0 doit valoir 0.95**5 (~0.77378)."
`,
      datasets: [],
      hints: [
        "Dans ajuster_crm, testez if nb_sinistres == 0: pour multiplier par 0.95, sinon else: pour multiplier par (1.25 ** nb_sinistres).",
        "Bornez avant le return grâce à : return min(3.50, max(0.50, nouveau_crm)).",
        "Pour la simulation : démarrez avec crm_final = 1.0, puis faites for _ in range(5): crm_final = ajuster_crm(crm_final, 0).",
      ],
      guide: {
        theoryToPracticeLink: `La relation markovienne $C_{t+1} = \\min(3.50, \\max(0.50, C_t \\cdot \\phi(N_{t+1})))$ se code littéralement avec \`if/else\` et \`min/max\`, puis une boucle \`for\` itère cette transition 5 fois pour obtenir $C_5 = 0.95^5$.`,
        stepByStepPlan: [
          "Définir `def ajuster_crm(crm_actuel, nb_sinistres):`.",
          "Calculer `nouveau_crm` : `* 0.95` si `nb_sinistres == 0`, sinon `* (1.25 ** nb_sinistres)`.",
          "Retourner `min(3.50, max(0.50, nouveau_crm))`.",
          "Initialiser `crm_final = 1.0` et appeler `ajuster_crm(crm_final, 0)` dans `for _ in range(5):`.",
        ],
        concepts: [
          {
            symbol: "min(3.50, max(0.50, x))",
            kind: "Syntaxe",
            roleInExercise: "Pattern standard de bornage (*clamping*) garantissant l'appartenance à $[0.50, 3.50]$.",
          },
          {
            symbol: "ajuster_crm",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction de transition annuelle du Bonus-Malus.",
          },
          {
            symbol: "range(5)",
            kind: "Fonction / Méthode",
            roleInExercise: "Génère exactement $5$ itérations (`0, 1, 2, 3, 4`) pour simuler $5$ années.",
          },
          {
            symbol: "_",
            kind: "Variable",
            roleInExercise: "Convention Python désignant un compteur de boucle dont la valeur n'est pas utilisée.",
          },
          {
            symbol: "crm_final",
            kind: "Variable",
            roleInExercise: "État final de la simulation après $5$ années sans sinistre ($0.77378...$).",
          },
        ],
        guidedCode: `def ajuster_crm(crm_actuel, nb_sinistres):
    if nb_sinistres == 0:
        nouveau_crm = crm_actuel * ___
    else:
        nouveau_crm = crm_actuel * (1.25 ** ___)
    # Bornage entre 0.50 et 3.50
    return min(___, max(___, nouveau_crm))

crm_final = 1.0
for _ in range(___):
    crm_final = ajuster_crm(crm_final, 0)

print(f"CRM final : {crm_final:.4f}")`,
      },
    },
    {
      id: "py-prog-12",
      title: "12. Analytique Obligataire : Duration & Convexité en Une Passe (Dict)",
      category: "alm",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 18,
      description: "Écrivez une fonction analyser_obligation(flux, taux) qui calcule en une seule boucle O(T) le prix, la duration de Macaulay, la duration modifiée et la convexité, et retourne ces 4 métriques dans un dictionnaire.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Développement de Taylor Obligataire, Duration & Convexité

#### Intuition Économique & Enjeux ALM
Pour immuniser le bilan d'un assureur ou d'une caisse de retraite contre les chocs de taux d'intérêt ($\\Delta r$), connaître le seul prix $P(r)$ ne suffit pas : il faut mesurer sa **sensibilité du premier ordre** (Duration) et sa **courbure du second ordre** (Convexité).
- La **Duration de Macaulay ($D_{\\text{mac}}$)** représente l'échéance moyenne pondérée des flux actualisés (en années).
- La **Duration Modifiée ($D_{\\text{mod}}$)** mesure la variation relative du prix pour une variation infinitésimale de taux.
- La **Convexité ($C$)** capture l'asymétrie favorable des obligations classiques : quand les taux baissent, le prix monte *plus* que ne le prédit la tangente linéaire ; quand ils montent, il baisse *moins*. En ALM, on cherche toujours $D_{\\text{actif}} = D_{\\text{passif}}$ et $C_{\\text{actif}} \\ge C_{\\text{passif}}$ (immunisation de Redington).

#### Démonstration Mathématique Formelle
Soit $P(r) = \\sum_{t=1}^T CF_t (1 + r)^{-t}$. Dérivons deux fois par rapport au taux $r$ :

1. **Dérivée première :**

   $$\\frac{\\partial P}{\\partial r} = -\\sum_{t=1}^T t \\cdot CF_t (1 + r)^{-t-1} = -\\frac{1}{1+r} \\sum_{t=1}^T t \\cdot \\frac{CF_t}{(1+r)^t}$$

   En posant la **Duration de Macaulay** $D_{\\text{mac}} = \\frac{1}{P} \\sum_{t=1}^T t \\cdot \\frac{CF_t}{(1+r)^t}$ et la **Duration Modifiée** $D_{\\text{mod}} = \\frac{D_{\\text{mac}}}{1 + r}$, on obtient $-\\frac{1}{P}\\frac{\\partial P}{\\partial r} = D_{\\text{mod}}$.

2. **Dérivée seconde :**

   $$\\frac{\\partial^2 P}{\\partial r^2} = \\sum_{t=1}^T t(t+1) \\cdot CF_t (1 + r)^{-t-2} \\implies C = \\frac{1}{P}\\frac{\\partial^2 P}{\\partial r^2} = \\frac{1}{P (1 + r)^2} \\sum_{t=1}^T t(t+1) \\cdot \\frac{CF_t}{(1+r)^t}$$

3. **Approximation de Taylor à l'ordre 2 :**

   $$\\frac{\\Delta P}{P} \\approx -D_{\\text{mod}}\\, \\Delta r + \\frac{1}{2}\\, C\\, (\\Delta r)^2$$

### 💻 Masterclass Programmation Python : Boucle à Multi-Accumulateurs & Retour par Dictionnaire

Au lieu d'écrire quatre fonctions séparées qui reparcourraient la liste \`flux\` quatre fois, une fonction Python bien conçue calcule les trois sommes intermédiaires **en une seule passe $O(T)$** :
- \`prix += va_t\`
- \`somme_t_va += t * va_t\`
- \`somme_t2_va += t * (t + 1) * va_t\`

Puis elle retourne un **dictionnaire structuré** \`{'prix': ..., 'duration_mac': ..., 'duration_mod': ..., 'convexite': ...}\` : retourner un \`dict\` pour 4 grandeurs nommées est nettement plus lisible et moins sujet aux erreurs d'ordre qu'un tuple à 4 éléments !

\`\`\`python
# Exemple exécuté : vérification de l'approximation de Taylor pour un choc de taux +100 bps (+1%)
def demo_greeks_oblig(flux, r):
    prix, s1, s2 = 0.0, 0.0, 0.0
    for t, cf in enumerate(flux, start=1):
        va = cf / ((1.0 + r) ** t)
        prix += va
        s1 += t * va
        s2 += t * (t + 1) * va
    d_mac = s1 / prix
    d_mod = d_mac / (1.0 + r)
    conv = s2 / (prix * ((1.0 + r) ** 2))
    return {'prix': prix, 'd_mac': d_mac, 'd_mod': d_mod, 'conv': conv}

oat_10y = [30.0] * 9 + [1030.0]  # Obligation 10 ans, coupon 3%
r0, dr = 0.03, 0.01               # Choc de +100 bps
g0 = demo_greeks_oblig(oat_10y, r0)
p_choc_exact = demo_greeks_oblig(oat_10y, r0 + dr)['prix']
dp_reel_pct = (p_choc_exact - g0['prix']) / g0['prix']
dp_taylor1_pct = -g0['d_mod'] * dr
dp_taylor2_pct = -g0['d_mod'] * dr + 0.5 * g0['conv'] * (dr ** 2)

print(f"Prix initial : {g0['prix']:.2f} | D_mac={g0['d_mac']:.2f} ans | D_mod={g0['d_mod']:.2f} | Conv={g0['conv']:.2f}")
print(f"Choc +100 bps -> Réel : {dp_reel_pct:.4%} | Taylor O1 : {dp_taylor1_pct:.4%} | Taylor O2 : {dp_taylor2_pct:.4%}")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Prix initial : 1000.00 | D_mac=8.79 ans | D_mod=8.53 | Conv=87.07
Choc +100 bps -> Réel : -8.1109% | Taylor O1 : -8.5302% | Taylor O2 : -8.0949%
\`\`\`

L'approximation linéaire (ordre 1) prédisait $-8.5302\\%$, mais le terme de convexité ($+\\frac{1}{2} \\times 87.07 \\times 0.01^2 = +0.435\\%$) corrige presque toute l'erreur pour atterrir à $-8.0949\\%$ (contre $-8.1109\\%$ exact) !`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Évaluez le profil de risque d'une obligation 5 ans au coupon de $4\\%$ (\`[40.0, 40.0, 40.0, 40.0, 1040.0]\`) au taux de marché $r = 3.5\\%$, en calculant prix, duration de Macaulay $D_{\\text{mac}}$, duration modifiée $D_{\\text{mod}} = D_{\\text{mac}} / (1+r)$ et convexité $C = \\frac{1}{P(1+r)^2}\\sum_{t=1}^T t(t+1)\\frac{CF_t}{(1+r)^t}$.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`def analyser_obligation(flux, taux):\` calculant en une seule boucle \`for t, cf in enumerate(flux, start=1):\` les 4 indicateurs et retournant un dictionnaire avec les **4 clés exactes** : \`'prix'\`, \`'duration_mac'\`, \`'duration_mod'\`, \`'convexite'\`.
2. Appelez la fonction sur \`flux_oat = [40.0, 40.0, 40.0, 40.0, 1040.0]\` et \`taux = 0.035\` en stockant le résultat dans \`analyse_oat = analyser_obligation(flux_oat, 0.035)\`.
3. Affichez \`analyse_oat\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `def analyser_obligation(flux, taux):
    """Calcule prix, duration Macaulay, duration modifiée et convexité en une passe."""
    prix = 0.0
    somme_t_va = 0.0
    somme_t2_va = 0.0

    for t, cf in enumerate(flux, start=1):
        va_t = cf / ((1.0 + taux) ** t)
        prix += va_t
        somme_t_va += t * va_t
        somme_t2_va += t * (t + 1) * va_t

    duration_mac = somme_t_va / prix
    duration_mod = duration_mac / (1.0 + taux)
    convexite = somme_t2_va / (prix * ((1.0 + taux) ** 2))

    return {
        'prix': prix,
        'duration_mac': duration_mac,
        'duration_mod': duration_mod,
        'convexite': convexite,
    }

flux_oat = [40.0, 40.0, 40.0, 40.0, 1040.0]
analyse_oat = analyser_obligation(flux_oat, 0.035)
print(analyse_oat)`,
      testPythonCode: `assert 'analyser_obligation' in globals() and callable(analyser_obligation), "La fonction analyser_obligation doit être définie."
assert 'analyse_oat' in globals() and isinstance(analyse_oat, dict), "analyse_oat doit être un dictionnaire."
assert set(analyse_oat.keys()) >= {'prix', 'duration_mac', 'duration_mod', 'convexite'}, "Clés requises : 'prix', 'duration_mac', 'duration_mod', 'convexite'."
assert abs(analyse_oat['prix'] - 1022.575267) < 1e-3, "prix incorrect dans analyse_oat."
assert abs(analyse_oat['duration_mac'] - 4.634585) < 1e-3, "duration_mac incorrecte dans analyse_oat."
assert abs(analyse_oat['duration_mod'] - 4.477860) < 1e-3, "duration_mod incorrecte dans analyse_oat."
assert abs(analyse_oat['convexite'] - 25.288284) < 1e-3, "convexite incorrecte dans analyse_oat."
zc = analyser_obligation([0.0, 0.0, 1000.0], 0.05)
assert abs(zc['duration_mac'] - 3.0) < 1e-6, "Pour un zéro-coupon 3 ans, duration_mac doit valoir exactement 3.0."
assert abs(zc['convexite'] - (12.0 / (1.05 ** 2))) < 1e-6, "Formule de convexité erronée sur le test zéro-coupon."
`,
      datasets: [],
      hints: [
        "Initialisez trois accumulateurs à 0.0 : prix, somme_t_va et somme_t2_va avant la boucle for t, cf in enumerate(flux, start=1):.",
        "À chaque tour, calculez va_t = cf / ((1.0 + taux) ** t), puis ajoutez va_t, t * va_t et t * (t + 1) * va_t.",
        "Après la boucle, divisez par prix (et (1 + taux) ou (1 + taux)**2), puis retournez le dict {'prix': ..., 'duration_mac': ..., 'duration_mod': ..., 'convexite': ...}.",
      ],
      guide: {
        theoryToPracticeLink: `Les trois sommes $\\sum VA_t$, $\\sum t \\cdot VA_t$ et $\\sum t(t+1) \\cdot VA_t$ partageant le même terme actualisé $VA_t = CF_t/(1+r)^t$, une seule boucle \`enumerate(flux, start=1)\` calcule l'ensemble des métriques obligataires retournées sous forme de dictionnaire.`,
        stepByStepPlan: [
          "Définir `def analyser_obligation(flux, taux):` et initialiser `prix = 0.0`, `somme_t_va = 0.0`, `somme_t2_va = 0.0`.",
          "Dans la boucle `for t, cf in enumerate(flux, start=1):`, calculer `va_t` et mettre à jour les 3 accumulateurs.",
          "Après la boucle, calculer `duration_mac`, `duration_mod` et `convexite`.",
          "Retourner le dictionnaire aux 4 clés exactes et l'évaluer dans `analyse_oat`.",
        ],
        concepts: [
          {
            symbol: "analyser_obligation",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction renvoyant un dictionnaire complet d'indicateurs obligataires.",
          },
          {
            symbol: "va_t",
            kind: "Variable",
            roleInExercise: "Valeur actuelle du flux à la date `t`, factorisée entre les trois sommes.",
          },
          {
            symbol: "duration_mac / duration_mod",
            kind: "Variable",
            roleInExercise: "Clés du dictionnaire mesurant respectivement l'échéance moyenne et la sensibilité au taux.",
          },
          {
            symbol: "convexite",
            kind: "Variable",
            roleInExercise: "Clé mesurant la courbure du prix $\\frac{1}{P}\\frac{\\partial^2 P}{\\partial r^2}$.",
          },
          {
            symbol: "return {...}",
            kind: "Syntaxe",
            roleInExercise: "Retour structuré sous forme de `dict` pour éviter toute ambiguïté d'ordre.",
          },
        ],
        guidedCode: `def analyser_obligation(flux, taux):
    prix = 0.0
    somme_t_va = 0.0
    somme_t2_va = 0.0

    for t, cf in enumerate(flux, start=1):
        va_t = cf / ((1.0 + taux) ** t)
        prix += va_t
        somme_t_va += t * ___
        somme_t2_va += t * (t + 1) * ___

    duration_mac = somme_t_va / prix
    duration_mod = duration_mac / (1.0 + ___)
    convexite = somme_t2_va / (prix * ((1.0 + ___) ** 2))

    return {
        'prix': prix,
        'duration_mac': duration_mac,
        'duration_mod': duration_mod,
        'convexite': convexite,
    }

flux_oat = [40.0, 40.0, 40.0, 40.0, 1040.0]
analyse_oat = analyser_obligation(flux_oat, 0.035)
print(analyse_oat)`,
      },
    },
    {
      id: "py-prog-13",
      title: "13. Portefeuille Multi-Lignes : Liste de Dictionnaires & Validation de Poids",
      category: "pricing",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 15,
      description: "Écrivez une fonction rendement_portefeuille(positions) parcourant une liste de dictionnaires pour calculer le rendement espéré pondéré tout en vérifiant que la somme des poids vaut ~1.0.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Linéarité de l'Espérance & Contrainte Budgétaire de Portefeuille

#### Intuition Économique & Enjeux d'Allocation d'Actifs
En gestion d'actifs et en ALM, un portefeuille investi sur $N$ lignes financières est caractérisé par le vecteur de ses pondérations $(w_1, \\dots, w_N)$ (part du capital allouée à chaque titre) et le vecteur de leurs rendements espérés $(\\mu_1, \\dots, \\mu_N)$. La **contrainte budgétaire de plein investissement** impose que $100\\%$ du capital soit alloué, soit $\\sum_{i=1}^N w_i = 1$.

Contrairement à la volatilité qui dépend non linéairement des corrélations entre actifs, le **rendement espéré du portefeuille** est rigoureusement linéaire par rapport aux poids. Vérifier la cohérence des poids ($\\sum w_i \\approx 1$) avant d'agréger protège contre les erreurs de saisie de mandat ou d'allocation partielle non détectée.

#### Démonstration Mathématique Formelle
Soit un portefeuille de $N$ actifs de rendements aléatoires $(R_1, \\dots, R_N)$ et de poids déterministes $(w_1, \\dots, w_N)$ vérifiant $\\sum_{i=1}^N w_i = 1$. Le rendement du portefeuille est la combinaison linéaire $R_p = \\sum_{i=1}^N w_i R_i$. Par linéarité de l'opérateur espérance $\\mathbb{E}[\\cdot]$ (sans aucune hypothèse d'indépendance) :

$$\\mathbb{E}[R_p] = \\mathbb{E}\\!\\left[\\sum_{i=1}^N w_i R_i\\right] = \\sum_{i=1}^N w_i\\, \\mathbb{E}[R_i] = \\mathbf{w}^\\top \\boldsymbol{\\mu}$$

### 💻 Masterclass Programmation Python : \`list[dict]\`, Tolérance Flottante & \`raise ValueError\`

Représenter un portefeuille par une **liste de dictionnaires** (\`[{'ticker': ..., 'poids': ..., 'rendement': ...}, ...]\`) est le standard Python avant même d'utiliser Pandas :
1. **Itération structurée** : \`for p in positions:\` extrait tour à tour chaque dictionnaire \`p\`, donnant accès à \`p['poids']\` et \`p['rendement']\`.
2. **Le piège de l'égalité stricte sur les flottants (\`== 1.0\`)** : en représentation binaire IEEE-754, \`0.1 + 0.2 + 0.7 == 1.0\` peut parfois échouer d'un epsilon (\`1e-16\`) comme \`0.1 + 0.2 == 0.30000000000000004\` ! On ne teste donc **jamais** \`somme_poids != 1.0\`, mais toujours \`abs(somme_poids - 1.0) > 1e-6\`.
3. **Signalement d'anomalie via \`raise ValueError(...)\`** : lorsqu'un contrat de données est violé (poids total différent de $100\\%$), lever explicitement une exception \`ValueError\` stoppe immédiatement l'exécution avec un message clair plutôt que de propager un rendement erroné.

\`\`\`python
# Exemple exécuté : portefeuille équipondéré sur les 5 titres de \`df_actifs\`
lignes_actifs = df_actifs[['ticker', 'rendement_espere']].to_dict('records')
n_actifs = len(lignes_actifs)
ptf_equi = [
    {'ticker': row['ticker'], 'poids': 1.0 / n_actifs, 'rendement': float(row['rendement_espere'])}
    for row in lignes_actifs
]

def calc_rendement_demo(positions):
    somme_w = sum(pos['poids'] for pos in positions)
    if abs(somme_w - 1.0) > 1e-6:
        raise ValueError(f"Somme des poids invalide : {somme_w:.6f} != 1.0")
    total_r = 0.0
    for pos in positions:
        total_r += pos['poids'] * pos['rendement']
    return total_r

print("Portefeuille équipondéré (5 titres) :", f"{calc_rendement_demo(ptf_equi):.4%}")
print("Test somme_w exacte (0.1 + 0.2 + 0.7) vs tolérance :", (0.1 + 0.2), "-> écart à 0.3 =", abs((0.1 + 0.2) - 0.3))
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Portefeuille équipondéré (5 titres) : 9.0400%
Test somme_w exacte (0.1 + 0.2 + 0.7) vs tolérance : 0.30000000000000004 -> écart à 0.3 = 5.551115123125783e-17
\`\`\`

L'écart binaire de \`5.55e-17\` sur \`0.1 + 0.2 - 0.3\` illustre concrètement pourquoi la tolérance \`abs(somme_poids - 1.0) > 1e-6\` est indispensable en ingénierie financière.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Calculez le rendement espéré d'un portefeuille à 3 positions $\\mathbb{E}[R_p] = \\sum_{i=1}^3 w_i \\mu_i$ tout en imposant la contrainte budgétaire $\\left|\\sum_{i=1}^3 w_i - 1\\right| \\le 10^{-6}$ (lever une \`ValueError\` si la somme des poids s'écarte de \`1.0\`).

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`def rendement_portefeuille(positions):\`
   - Parcourt la liste de dictionnaires \`positions\` (clés \`'poids'\` et \`'rendement'\`).
   - Vérifie que la somme des poids vaut \`1.0\` à \`1e-6\` près, sinon lève \`raise ValueError("La somme des poids doit valoir 1.0")\`.
   - Retourne la somme pondérée \`float\`.
2. Définissez la liste de 3 positions :
   \`positions = [{'ticker': 'TTE', 'poids': 0.40, 'rendement': 0.085}, {'ticker': 'MC', 'poids': 0.35, 'rendement': 0.115}, {'ticker': 'AI', 'poids': 0.25, 'rendement': 0.078}]\`
3. Calculez \`rendement_ptf = rendement_portefeuille(positions)\` et affichez le résultat.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `def rendement_portefeuille(positions):
    """Calcule le rendement espéré d'un portefeuille après validation des poids."""
    somme_poids = 0.0
    rendement_total = 0.0
    for p in positions:
        somme_poids += p['poids']
        rendement_total += p['poids'] * p['rendement']

    if abs(somme_poids - 1.0) > 1e-6:
        raise ValueError(f"Somme des poids invalide : {somme_poids:.6f} (attendu ~ 1.0)")

    return rendement_total

positions = [
    {'ticker': 'TTE', 'poids': 0.40, 'rendement': 0.085},
    {'ticker': 'MC',  'poids': 0.35, 'rendement': 0.115},
    {'ticker': 'AI',  'poids': 0.25, 'rendement': 0.078},
]

rendement_ptf = rendement_portefeuille(positions)
print(f"Rendement espéré du portefeuille : {rendement_ptf:.4%}")`,
      testPythonCode: `assert 'rendement_portefeuille' in globals() and callable(rendement_portefeuille), "La fonction rendement_portefeuille doit être définie."
assert 'positions' in globals() and isinstance(positions, list) and len(positions) == 3, "positions doit être une liste de 3 dictionnaires."
assert 'rendement_ptf' in globals() and abs(rendement_ptf - 0.09375) < 1e-9, "rendement_ptf doit valoir 0.09375 (9.375%)."
assert abs(rendement_portefeuille([{'poids': 0.5, 'rendement': 0.10}, {'poids': 0.5, 'rendement': 0.04}]) - 0.07) < 1e-9, "La fonction doit être générique pour toute liste de positions."
erreur_levee = False
try:
    rendement_portefeuille([{'poids': 0.4, 'rendement': 0.10}, {'poids': 0.4, 'rendement': 0.05}])
except ValueError:
    erreur_levee = True
assert erreur_levee, "La fonction doit lever ValueError si la somme des poids ne vaut pas ~1.0." `,
      datasets: [],
      hints: [
        "Dans une boucle for p in positions:, accumulez simultanément somme_poids += p['poids'] et rendement_total += p['poids'] * p['rendement'].",
        "Vérifiez la tolérance flottante : if abs(somme_poids - 1.0) > 1e-6: raise ValueError(...).",
        "Vérifiez votre calcul : 0.40*0.085 + 0.35*0.115 + 0.25*0.078 = 0.034 + 0.04025 + 0.0195 = 0.09375.",
      ],
      guide: {
        theoryToPracticeLink: `La linéarité $\\sum w_i \\mu_i$ sous contrainte $\\sum w_i = 1$ s'implémente en parcourant la liste de dictionnaires \`positions\` avec \`abs(somme_poids - 1.0) > 1e-6\` pour contrôler la contrainte budgétaire sans subir l'imprécision binaire IEEE-754.`,
        stepByStepPlan: [
          "Définir `def rendement_portefeuille(positions):` et initialiser `somme_poids = 0.0` et `rendement_total = 0.0`.",
          "Parcourir `for p in positions:` et accumuler poids et produit `p['poids'] * p['rendement']`.",
          "Contrôler `if abs(somme_poids - 1.0) > 1e-6: raise ValueError(...)` avant `return rendement_total`.",
          "Créer la liste `positions` (3 dicts) et calculer `rendement_ptf = rendement_portefeuille(positions)`.",
        ],
        concepts: [
          {
            symbol: "list[dict]",
            kind: "Syntaxe",
            roleInExercise: "Structure tabulaire native représentant un portefeuille d'actifs ligne par ligne.",
          },
          {
            symbol: "abs(x - 1.0) > 1e-6",
            kind: "Syntaxe",
            roleInExercise: "Comparaison numérique sécurisée avec tolérance contre les artefacts IEEE-754.",
          },
          {
            symbol: "raise ValueError(...)",
            kind: "Syntaxe",
            roleInExercise: "Lève explicitement une exception métier si la somme des poids est incohérente.",
          },
          {
            symbol: "rendement_portefeuille",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction validant les poids et calculant le rendement espéré du portefeuille.",
          },
          {
            symbol: "rendement_ptf",
            kind: "Variable",
            roleInExercise: "Rendement espéré résultant (`0.09375`, soit $9.375\\%$).",
          },
        ],
        guidedCode: `def rendement_portefeuille(positions):
    somme_poids = 0.0
    rendement_total = 0.0
    for p in positions:
        somme_poids += p['___']
        rendement_total += p['___'] * p['___']

    if abs(somme_poids - 1.0) > ___:
        raise ValueError("La somme des poids doit valoir 1.0")

    return ___

positions = [
    {'ticker': 'TTE', 'poids': 0.40, 'rendement': 0.085},
    {'ticker': 'MC',  'poids': 0.35, 'rendement': 0.115},
    {'ticker': 'AI',  'poids': 0.25, 'rendement': 0.078},
]

rendement_ptf = rendement_portefeuille(positions)
print(f"Rendement portefeuille : {rendement_ptf:.4%}")`,
      },
    },
    {
      id: "py-prog-14",
      title: "14. Filtrage ESG & Mapping Sharpe (List & Dict Comprehensions)",
      category: "data_prep",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 15,
      description: "Utilisez les compréhensions de liste ([... for ... if ...]) et de dictionnaire ({k: v for ...}) sur un univers de 5 titres pour filtrer les actifs éligibles ESG (>= 80) et construire un index des ratios de Sharpe.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Filtrage SFDR (*Best-in-Class*) & Ratio de Sharpe

#### Intuition Économique & Enjeux d'Investissement Responsable
Dans les mandats institutionnels européens (réglementation SFDR Articles 8 et 9), les gérants appliquent d'abord un **filtre d'exclusion ou de sélectivité extra-financière** (*ESG screening*) — par exemple en ne conservant que les émetteurs atteignant un score ESG minimal ($\\ge 80/100$) — avant d'optimiser le couple rendement-risque des titres retenus.

La mesure canonique de performance ajustée du risque est le **Ratio de Sharpe**, qui rapporte l'excès de rendement espéré au-dessus du taux sans risque $r_f$ à la volatilité totale $\\sigma_i$ de l'actif.

#### Démonstration Mathématique Formelle
Soit un univers d'investissement $\\mathcal{U} = \\{1, \\dots, N\\}$ où chaque titre $i$ est décrit par son score extra-financier $E_i \\in [0, 100]$ et son ratio de Sharpe :

$$SR_i = \\frac{\\mathbb{E}[R_i] - r_f}{\\sigma_i}$$

Le sous-univers investissable sous contrainte ESG au seuil $\\tau = 80$ correspond à l'ensemble en compréhension mathématique :

$$\\mathcal{U}_{\\text{ESG}} = \\{ i \\in \\mathcal{U} \\mid E_i \\ge 80 \\}$$

Et l'application d'indexation vers le ratio de Sharpe est la bijection partielle $i \\mapsto SR_i$ définie sur $\\mathcal{U}$.

### 💻 Masterclass Programmation Python : Compréhensions de Liste & Dictionnaire

La syntaxe des **compréhensions Python** transpose mot pour mot la notation ensembliste $\\{ f(x) \\mid x \\in \\mathcal{U},\\ P(x) \\}$ :
1. **List comprehension** :
   \`[a['ticker'] for a in univers if a['score_esg'] >= 80]\`
   Remplace 4 lignes (\`res = []\`, \`for a in univers:\`, \`if ...:\`, \`res.append(...)\`) par une expression unique, plus lisible et exécutée plus rapidement par la machine virtuelle CPython (sans appel répété à la méthode \`.append\`).
2. **Dict comprehension** :
   \`{a['ticker']: a['ratio_sharpe'] for a in univers}\`
   Construit en une ligne un dictionnaire de recherche rapide (*lookup table* en $O(1)$) associant chaque \`ticker\` à son \`ratio_sharpe\`.
3. **Filtrage dans un dict** : on peut aussi combiner les deux : \`{a['ticker']: a['ratio_sharpe'] for a in univers if a['score_esg'] >= 80}\`.

\`\`\`python
# Exemple exécuté directement sur la table réelle \`df_actifs\` convertie en liste de dicts
univers_reel = df_actifs.to_dict('records')

# 1. Compréhension de liste : tickers du secteur Finance ou Diversifié ayant beta <= 1.05
defensifs = [row['ticker'] for row in univers_reel if row['beta_marche'] <= 1.0]

# 2. Compréhension de dictionnaire : mapping ticker -> volatilité
vol_map = {row['ticker']: float(row['volatilite']) for row in univers_reel}

print("Actifs défensifs (beta <= 1.0) :", defensifs)
print("Dictionnaire des volatilités   :", vol_map)
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Actifs défensifs (beta <= 1.0) : ['TTE', 'AI', 'CW8']
Dictionnaire des volatilités   : {'TTE': 0.22, 'BNP': 0.26, 'MC': 0.21, 'AI': 0.16, 'CW8': 0.15}
\`\`\`

Remarquez la clarté immédiate des compréhensions : l'intention mathématique (« sélectionner les tickers dont le bêta vérifie $\\beta \\le 1.0$ ») se lit en une seule phrase Python.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
À partir de l'univers des $5$ titres issu de \`df_actifs\` (\`TTE\`, \`BNP\`, \`MC\`, \`AI\`, \`CW8\`), isolez la liste ordonnée des émetteurs satisfaisant le critère ESG $\\ge 80$ et construisez le dictionnaire de correspondance \`ticker -> ratio_sharpe\`.

**Volet 2 — Laboratoire Pratique Python :**
Définissez l'univers :
\`\`\`python
univers = [
    {'ticker': 'TTE', 'score_esg': 78, 'ratio_sharpe': 0.25},
    {'ticker': 'BNP', 'score_esg': 74, 'ratio_sharpe': 0.24},
    {'ticker': 'MC',  'score_esg': 86, 'ratio_sharpe': 0.40},
    {'ticker': 'AI',  'score_esg': 92, 'ratio_sharpe': 0.30},
    {'ticker': 'CW8', 'score_esg': 80, 'ratio_sharpe': 0.35},
]
\`\`\`
Puis construisez **par compréhension** :
1. \`tickers_esg\` (\`list\`) : compréhension de liste des \`'ticker'\` dont \`'score_esg' >= 80\`.
2. \`sharpe_map\` (\`dict\`) : compréhension de dictionnaire associant chaque \`'ticker'\` à son \`'ratio_sharpe'\`.
3. Affichez \`tickers_esg\` et \`sharpe_map\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `univers = [
    {'ticker': 'TTE', 'score_esg': 78, 'ratio_sharpe': 0.25},
    {'ticker': 'BNP', 'score_esg': 74, 'ratio_sharpe': 0.24},
    {'ticker': 'MC',  'score_esg': 86, 'ratio_sharpe': 0.40},
    {'ticker': 'AI',  'score_esg': 92, 'ratio_sharpe': 0.30},
    {'ticker': 'CW8', 'score_esg': 80, 'ratio_sharpe': 0.35},
]

tickers_esg = [a['ticker'] for a in univers if a['score_esg'] >= 80]
sharpe_map = {a['ticker']: a['ratio_sharpe'] for a in univers}

print("Titres éligibles ESG (>= 80) :", tickers_esg)
print("Mapping Sharpe :", sharpe_map)`,
      testPythonCode: `assert 'univers' in globals() and len(univers) == 5, "La liste univers doit contenir les 5 actifs."
assert 'tickers_esg' in globals() and tickers_esg == ['MC', 'AI', 'CW8'], "tickers_esg doit valoir ['MC', 'AI', 'CW8'] (attention à >= 80 qui inclut CW8)."
assert 'sharpe_map' in globals() and sharpe_map == {'TTE': 0.25, 'BNP': 0.24, 'MC': 0.40, 'AI': 0.30, 'CW8': 0.35}, "sharpe_map incorrect." `,
      datasets: [],
      hints: [
        "Pour la compréhension de liste filtrée : tickers_esg = [a['ticker'] for a in univers if a['score_esg'] >= 80].",
        "Attention au signe >= 80 (et non > 80) afin d'inclure CW8 dont le score vaut exactement 80.",
        "Pour la compréhension de dictionnaire : sharpe_map = {a['ticker']: a['ratio_sharpe'] for a in univers}.",
      ],
      guide: {
        theoryToPracticeLink: `L'ensemble mathématique $\\mathcal{U}_{\\text{ESG}} = \\{i \\in \\mathcal{U} \\mid E_i \\ge 80\\}$ s'écrit directement \`[a['ticker'] for a in univers if a['score_esg'] >= 80]\`, et la table de correspondance des Sharpe devient \`{a['ticker']: a['ratio_sharpe'] for a in univers}\`.`,
        stepByStepPlan: [
          "Définir la liste `univers` des 5 dictionnaires d'actifs (`TTE`, `BNP`, `MC`, `AI`, `CW8`).",
          "Construire `tickers_esg` par list comprehension avec la condition `a['score_esg'] >= 80`.",
          "Construire `sharpe_map` par dict comprehension associant `a['ticker']` à `a['ratio_sharpe']`.",
          "Afficher `tickers_esg` et `sharpe_map`.",
        ],
        concepts: [
          {
            symbol: "[expr for x in L if cond]",
            kind: "Syntaxe",
            roleInExercise: "Compréhension de liste filtrante remplaçant une boucle `for` + `.append()`.",
          },
          {
            symbol: "{k: v for x in L}",
            kind: "Syntaxe",
            roleInExercise: "Compréhension de dictionnaire construisant un mapping clé-valeur en une ligne.",
          },
          {
            symbol: "tickers_esg",
            kind: "Variable",
            roleInExercise: "Liste des 3 tickers conformes (`['MC', 'AI', 'CW8']`).",
          },
          {
            symbol: "sharpe_map",
            kind: "Variable",
            roleInExercise: "Dictionnaire associant chacun des 5 tickers à son ratio de Sharpe.",
          },
          {
            symbol: ">= 80",
            kind: "Paramètre",
            roleInExercise: "Seuil inclusif d'éligibilité extra-financière retenant `CW8` (score `80`).",
          },
        ],
        guidedCode: `univers = [
    {'ticker': 'TTE', 'score_esg': 78, 'ratio_sharpe': 0.25},
    {'ticker': 'BNP', 'score_esg': 74, 'ratio_sharpe': 0.24},
    {'ticker': 'MC',  'score_esg': 86, 'ratio_sharpe': 0.40},
    {'ticker': 'AI',  'score_esg': 92, 'ratio_sharpe': 0.30},
    {'ticker': 'CW8', 'score_esg': 80, 'ratio_sharpe': 0.35},
]

# 1. List comprehension avec filtre >= 80
tickers_esg = [a['___'] for a in univers if a['___'] >= ___]

# 2. Dict comprehension ticker -> ratio_sharpe
sharpe_map = {a['___']: a['___'] for a in univers}

print(tickers_esg, sharpe_map)`,
      },
    },
    {
      id: "py-prog-15",
      title: "15. Horizon de Doublement d'un Capital (Boucle while)",
      category: "alm",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 16,
      description: "Implémentez une boucle while dans annees_doublement(taux_annuel) pour déterminer le nombre entier d'années nécessaires afin qu'un capital initial de 1.0 atteigne ou dépasse 2.0.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Temps de Doublement & Règle de 72

#### Intuition Économique & Enjeux Patrimoniaux
En gestion de patrimoine et en planification retraite, une question récurrente est : « Combien d'années faut-il pour doubler un capital investi à un taux annuel composé $r$ ? ».
Les praticiens utilisent l'heuristique célèbre de la **Règle de 72** : diviser $72$ par le taux en pourcentage donne une estimation rapide du temps de doublement (à $4\\%$, $72 / 4 = 18$ ans ; à $6\\%$, $72 / 6 = 12$ ans).

#### Démonstration Mathématique Formelle
En temps continu, $e^{r T^*} = 2 \\iff T^* = \\frac{\\ln 2}{r} \\approx \\frac{0.6931}{r}$. En capitalisation discrète annuelle au taux $r > 0$, on cherche le plus petit entier $n \\in \\mathbb{N}^*$ tel que :

$$(1 + r)^n \\ge 2 \\iff n = \\left\\lceil \\frac{\\ln 2}{\\ln(1 + r)} \\right\\rceil$$

Par exemple, pour $r = 4\\%$ ($0.04$), $\\frac{\\ln 2}{\\ln(1.04)} \\approx \\frac{0.693147}{0.039221} \\approx 17.673$ ans. En pratique, avec versement annuel discret des intérêts, le capital vaut $1.04^{17} \\approx 1.9479 < 2.0$ à la fin de l'année $17$, et franchit $2.0$ à la fin de l'année $n = 18$ ($1.04^{18} \\approx 2.0258$).

### 💻 Masterclass Programmation Python : Boucle \`while\`, Condition d'Arrêt & Garde Anti-Boucle Infinie

On utilise \`for\` quand le nombre d'itérations est connu à l'avance, et **\`while\`** quand on itère **jusqu'à atteindre un seuil objectif** (\`while capital < 2.0:\`) :
1. **Anatomie sûre d'un \`while\`** :
   - Initialisation *avant* le \`while\` : \`capital = 1.0\`, \`annees = 0\`.
   - Condition de continuation : \`while capital < 2.0:\` (la boucle s'arrête dès que \`capital >= 2.0\`).
   - Progression stricte *dans* le \`while\` : \`capital *= (1.0 + taux_annuel)\` et \`annees += 1\`.
2. **Protection contre la boucle infinie** : si un utilisateur passait \`taux_annuel = 0.0\` ou \`-0.02\`, \`capital\` n'augmenterait jamais et le programme tournerait à l'infini (déclenchant le Watchdog Timeout) ! Ajouter \`if taux_annuel <= 0: raise ValueError("Le taux doit être strictement positif")\` garantit mathématiquement la terminaison de la boucle.

\`\`\`python
# Exemple exécuté : horizon de doublement pour différents rendements obligataires (2% à 8%)
def demo_doublement(r):
    if r <= 0:
        raise ValueError("Le taux doit être > 0.")
    cap, n = 1.0, 0
    while cap < 2.0:
        cap *= (1.0 + r)
        n += 1
    return n, cap

for r_pct in [2, 3, 4, 6, 8]:
    nb_ans, cap_final = demo_doublement(r_pct / 100.0)
    print(f"Taux = {r_pct}% -> {nb_ans:2d} ans (capital = {cap_final:.4f} | règle de 72 = {72/r_pct:.1f} ans)")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Taux = 2% -> 36 ans (capital = 2.0399 | règle de 72 = 36.0 ans)
Taux = 3% -> 24 ans (capital = 2.0328 | règle de 72 = 24.0 ans)
Taux = 4% -> 18 ans (capital = 2.0258 | règle de 72 = 18.0 ans)
Taux = 6% -> 12 ans (capital = 2.0122 | règle de 72 = 12.0 ans)
Taux = 8% -> 10 ans (capital = 2.1589 | règle de 72 = 9.0 ans)
\`\`\`

La boucle \`while\` confirme exactement la précision remarquable de la règle de 72 autour des taux intermédiaires ($4\\%$ $\\to 18$ ans, $6\\%$ $\\to 12$ ans).`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Déterminez par simulation itérative l'entier $n = \\min \\{ k \\in \\mathbb{N} : (1 + r)^k \\ge 2.0 \\}$ sans utiliser de logarithme, en protégeant l'algorithme contre tout taux nul ou négatif ($r \\le 0$).

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`def annees_doublement(taux_annuel):\`
   - Lève \`ValueError\` si \`taux_annuel <= 0\`.
   - Initialise \`capital = 1.0\` et \`annees = 0\`.
   - Tant que \`capital < 2.0\` (\`while\`), multiplie \`capital\` par \`(1.0 + taux_annuel)\` et incrémente \`annees\` de \`1\`.
   - Retourne l'entier \`annees\`.
2. Calculez \`n_4pct = annees_doublement(0.04)\` et affichez le résultat.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `def annees_doublement(taux_annuel):
    """Compte le nombre d'années entières pour au moins doubler un capital via while."""
    if taux_annuel <= 0:
        raise ValueError("Le taux annuel doit être strictement positif.")

    capital = 1.0
    annees = 0
    while capital < 2.0:
        capital *= (1.0 + taux_annuel)
        annees += 1

    return annees

n_4pct = annees_doublement(0.04)
print(f"À 4% par an, le capital double en {n_4pct} ans.")`,
      testPythonCode: `assert 'annees_doublement' in globals() and callable(annees_doublement), "La fonction annees_doublement doit être définie."
assert 'n_4pct' in globals() and isinstance(n_4pct, int) and n_4pct == 18, "À 4%, n_4pct doit valoir l'entier 18 (1.04**17 = 1.9479 < 2 <= 1.04**18 = 2.0258)."
assert annees_doublement(0.08) == 10, "À 8%, le capital double en 10 ans (1.08**9 = 1.999 < 2)."
assert annees_doublement(1.0) == 1, "À 100%, le capital double en 1 an."
err = False
try:
    annees_doublement(0.0)
except ValueError:
    err = True
assert err, "La fonction doit lever ValueError si taux_annuel <= 0 pour éviter une boucle infinie." `,
      datasets: [],
      hints: [
        "Ajoutez d'abord if taux_annuel <= 0: raise ValueError(...) pour garantir la terminaison du while.",
        "Initialisez capital = 1.0 et annees = 0, puis écrivez while capital < 2.0:.",
        "À l'intérieur du while, faites capital *= (1.0 + taux_annuel) et annees += 1, puis return annees après la boucle.",
      ],
      guide: {
        theoryToPracticeLink: `La condition mathématique $(1+r)^n \\ge 2$ détermine le seuil d'arrêt de la boucle \`while capital < 2.0:\`, dont l'invariant \`capital = (1 + r)^annees\` progresse strictement à chaque tour tant que \`taux_annuel > 0\`.`,
        stepByStepPlan: [
          "Définir `def annees_doublement(taux_annuel):` et lever `ValueError` si `taux_annuel <= 0`.",
          "Initialiser `capital = 1.0` et `annees = 0`.",
          "Boucler avec `while capital < 2.0:` en multipliant `capital` par `(1.0 + taux_annuel)` et en ajoutant `1` à `annees`.",
          "Retourner `annees` et calculer `n_4pct = annees_doublement(0.04)`.",
        ],
        concepts: [
          {
            symbol: "while capital < 2.0:",
            kind: "Syntaxe",
            roleInExercise: "Boucle conditionnelle s'exécutant tant que l'objectif de doublement n'est pas atteint.",
          },
          {
            symbol: "annees_doublement",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction renvoyant l'entier minimal d'années pour dépasser `2.0`.",
          },
          {
            symbol: "Terminaison (invariant)",
            kind: "Syntaxe",
            roleInExercise: "Garantie par `taux_annuel > 0` que `capital` croît strictement et dépasse `2.0` en temps fini.",
          },
          {
            symbol: "n_4pct",
            kind: "Variable",
            roleInExercise: "Nombre entier d'années à $4\\%$ (`18` ans).",
          },
          {
            symbol: "capital = 1.0 / annees = 0",
            kind: "Variable",
            roleInExercise: "Variables d'état initialisées avant le `while` (à l'année 0, le capital vaut `1.0`).",
          },
        ],
        guidedCode: `def annees_doublement(taux_annuel):
    if taux_annuel <= 0:
        raise ValueError("Le taux doit être strictement positif.")

    capital = 1.0
    annees = 0
    while capital < ___:
        capital *= (1.0 + ___)
        annees += ___
    return ___

n_4pct = annees_doublement(0.04)
print(f"Horizon de doublement à 4% : {n_4pct} ans")`,
      },
    },
    {
      id: "py-prog-16",
      title: "16. Taux Interne de Rentabilité (TRI / IRR) par Bissection (while)",
      category: "alm",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 20,
      description: "Codez deux fonctions composées — van(flux, taux) et l'algorithme de bissection while calculer_tri(flux, bas=0.0, haut=0.5, tol=1e-6) — pour trouver le TRI d'un projet d'investissement.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Valeur Actuelle Nette (VAN) & Recherche de Racine du TRI par Dichotomie

#### Intuition Économique & Enjeux de Choix d'Investissement
En finance d'entreprise, *Private Equity* et ALM, un projet d'investissement exige une sortie de fonds initiale $CF_0 < 0$ suivie de flux positifs $(CF_1, \\dots, CF_T)$. Le **Taux Interne de Rentabilité (TRI / IRR)** est le taux d'actualisation critique $r^*$ qui annule exactement la **Valeur Actuelle Nette (VAN)** : c'est le rendement intrinsèque du projet (ou le taux actuariel / *Yield-to-Maturity* d'une obligation si $CF_0 = -P_{\\text{marché}}$).

Pour $T \\ge 3$, l'équation $\\text{VAN}(r) = 0$ est un polynôme de degré $T$ sans solution analytique générale par radicaux (théorème d'Abel-Ruffini) : elle nécessite obligatoirement une **résolution numérique itérative** (bissection ou Newton-Raphson).

#### Démonstration Mathématique Formelle
Soit un projet conventionnel ($CF_0 < 0$ et $CF_t \\ge 0$ pour $t \\ge 1$ avec au moins un $CF_t > 0$) :

$$\\text{VAN}(r) = \\sum_{t=0}^T \\frac{CF_t}{(1 + r)^t} = CF_0 + \\sum_{t=1}^T \\frac{CF_t}{(1 + r)^t}$$

1. **Monotonie stricte :** Sur $r > -1$, la dérivée vaut $\\text{VAN}'(r) = -\\sum_{t=1}^T t \\cdot CF_t (1+r)^{-t-1} < 0$. $\\text{VAN}(r)$ est donc continue et strictement décroissante.
2. **Théorème des Valeurs Intermédiaires (TVI) :** Si l'on encadre la racine dans $[a_0, b_0]$ avec $\\text{VAN}(a_0) > 0$ et $\\text{VAN}(b_0) < 0$, il existe un unique $r^* \\in ]a_0, b_0[$ tel que $\\text{VAN}(r^*) = 0$.
3. **Convergence de la bissection :** À chaque étape $k$, on teste le milieu $m_k = \\frac{a_k + b_k}{2}$. Si $\\text{VAN}(m_k) > 0$, la racine est dans $[m_k, b_k]$ (on pose $a_{k+1} = m_k$) ; sinon dans $[a_k, m_k]$ ($b_{k+1} = m_k$). La largeur de l'intervalle est divisée par $2$ à chaque itération :

$$|b_k - a_k| = \\frac{b_0 - a_0}{2^k} \\le \\varepsilon \\iff k \\ge \\log_2\\!\\left(\\frac{b_0 - a_0}{\\varepsilon}\\right)$$

Pour $[0.0, 0.5]$ et $\\varepsilon = 10^{-6}$, $k = 19$ itérations suffisent toujours !

### 💻 Masterclass Programmation Python : Composition de Fonctions & Algorithme de Dichotomie

Deux subtilités clés distinguent cet exercice :
1. **\`enumerate(flux)\` démarre à \`t = 0\` (et NON \`start=1\`)** : dans \`van(flux, taux)\`, le premier élément \`flux[0]\` est le décaissement initial $CF_0$ en $t = 0$, dont le facteur d'actualisation est $(1+r)^0 = 1$.
2. **Composition fonctionnelle** : \`calculer_tri\` appelle votre fonction \`van(flux, milieu)\` à chaque itération du \`while (haut - bas) > tol:\`, illustrant la modularité en Python (chaque fonction a une responsabilité unique).

\`\`\`python
# Exemple exécuté : calcul du Yield-to-Maturity (TRI obligataire) d'une OAT cotée 965 EUR (nominal 1000, coupon 3.2%, 4 ans)
def van_demo(flux, r):
    return sum(cf / ((1.0 + r) ** t) for t, cf in enumerate(flux))  # start=0 par défaut !

oat_flux = [-965.0, 32.0, 32.0, 32.0, 1032.0]
a, b, tol = 0.0, 0.20, 1e-7
etapes = 0
while (b - a) > tol:
    m = (a + b) / 2.0
    if van_demo(oat_flux, m) > 0.0:
        a = m
    else:
        b = m
    etapes += 1

ytm = (a + b) / 2.0
print(f"Convergence en {etapes} itérations | YTM = {ytm:.5%} | VAN(YTM) = {van_demo(oat_flux, ytm):.2e} EUR")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Convergence en 21 itérations | YTM = 4.16804% | VAN(YTM) = -6.57e-05 EUR
\`\`\`

En seulement $21$ itérations, la bissection trouve le rendement actuariel exact ($4.16804\\%$, supérieur au coupon $3.2\\%$ car le titre cote sous le pair à $96.5\\%$) avec un résidu inférieur au millième de centime.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Calculez le Taux Interne de Rentabilité $r^*$ du projet \`[-10000.0, 3500.0, 4000.0, 4500.0]\` en résolvant $\\text{VAN}(r^*) = \\sum_{t=0}^3 \\frac{CF_t}{(1+r^*)^t} = 0$ par bissection sur $[0.0, 0.5]$ à la précision \`1e-6\`.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`def van(flux, taux):\` calculant $\\sum_{t=0}^T \\frac{CF_t}{(1+\\text{taux})^t}$ (attention : \`enumerate(flux)\` démarre à \`t = 0\` !).
2. \`def calculer_tri(flux, bas=0.0, haut=0.5, tol=1e-6):\` utilisant une boucle \`while (haut - bas) > tol:\` avec \`milieu = (bas + haut) / 2.0\`, appelant \`van(flux, milieu)\`, mettant à jour \`bas = milieu\` si \`van(flux, milieu) > 0\` sinon \`haut = milieu\`, et retournant \`(bas + haut) / 2.0\`.
3. Définissez \`flux_projet = [-10000.0, 3500.0, 4000.0, 4500.0]\` et calculez \`tri = calculer_tri(flux_projet)\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `def van(flux, taux):
    """Calcule la Valeur Actuelle Nette d'une chronique démarrant à t=0."""
    total = 0.0
    for t, cf in enumerate(flux):
        total += cf / ((1.0 + taux) ** t)
    return total

def calculer_tri(flux, bas=0.0, haut=0.5, tol=1e-6):
    """Trouve le TRI par dichotomie (bissection) sur l'intervalle [bas, haut]."""
    while (haut - bas) > tol:
        milieu = (bas + haut) / 2.0
        if van(flux, milieu) > 0.0:
            bas = milieu
        else:
            haut = milieu
    return (bas + haut) / 2.0

flux_projet = [-10000.0, 3500.0, 4000.0, 4500.0]
tri = calculer_tri(flux_projet)

print(f"TRI du projet : {tri:.4%} | Contrôle VAN(TRI) : {van(flux_projet, tri):.6f} EUR")`,
      testPythonCode: `assert 'van' in globals() and callable(van), "La fonction van(flux, taux) doit être définie."
assert abs(van([-100.0, 110.0], 0.10)) < 1e-9, "van([-100, 110], 0.10) doit valoir 0.0 (t=0 pour le flux initial)."
assert 'calculer_tri' in globals() and callable(calculer_tri), "La fonction calculer_tri doit être définie."
assert 'flux_projet' in globals() and flux_projet == [-10000.0, 3500.0, 4000.0, 4500.0]
assert 'tri' in globals() and abs(tri - 0.0928244) < 1e-4, "tri incorrect (attendu ~ 9.2824%)."
assert abs(van(flux_projet, tri)) < 0.05, "VAN(flux_projet, tri) doit être proche de 0."
assert abs(calculer_tri([-1000.0, 1200.0]) - 0.20) < 1e-4, "calculer_tri([-1000, 1200]) doit retourner ~0.20." `,
      datasets: [],
      hints: [
        "Dans van(flux, taux), utilisez for t, cf in enumerate(flux): SANS start=1 afin que flux[0] soit divisé par (1 + taux)**0 = 1.",
        "Dans calculer_tri, bouclez tant que (haut - bas) > tol: et évaluez milieu = (bas + haut) / 2.0.",
        "Comme la VAN est décroissante, si van(flux, milieu) > 0, la racine est plus à droite : posez bas = milieu ; sinon haut = milieu.",
      ],
      guide: {
        theoryToPracticeLink: `Le Théorème des Valeurs Intermédiaires appliqué à la fonction décroissante $\\text{VAN}(r)$ (calculée via \`van(flux, taux)\` dès $t=0$) garantit qu'en conservant \`van(bas) > 0 >= van(haut)\` dans la boucle \`while\`, la largeur \`(haut - bas)\` converge exponentiellement vers zéro.`,
        stepByStepPlan: [
          "Définir `def van(flux, taux):` avec `enumerate(flux)` (démarrant à `t = 0`).",
          "Définir `def calculer_tri(flux, bas=0.0, haut=0.5, tol=1e-6):`.",
          "Dans `while (haut - bas) > tol:`, calculer `milieu = (bas + haut) / 2.0` et déplacer `bas` si `van(flux, milieu) > 0` ou `haut` sinon.",
          "Retourner `(bas + haut) / 2.0` et évaluer `tri = calculer_tri(flux_projet)`.",
        ],
        concepts: [
          {
            symbol: "van(flux, taux)",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule la VAN en démarrant à l'indice `t = 0` (`enumerate(flux)` sans `start=1`).",
          },
          {
            symbol: "calculer_tri",
            kind: "Fonction / Méthode",
            roleInExercise: "Algorithme de bissection appelant `van` dans sa boucle `while`.",
          },
          {
            symbol: "bas=0.0, haut=0.5, tol=1e-6",
            kind: "Paramètre",
            roleInExercise: "Bornes de recherche initiales et précision d'arrêt de la dichotomie.",
          },
          {
            symbol: "milieu",
            kind: "Variable",
            roleInExercise: "Point médian testé à chaque division par $2$ de l'intervalle.",
          },
          {
            symbol: "tri",
            kind: "Variable",
            roleInExercise: "Taux interne de rentabilité trouvé ($\\approx 9.2824\\%$).",
          },
        ],
        guidedCode: `def van(flux, taux):
    total = 0.0
    # Attention : enumerate(flux) commence à t=0 pour l'investissement initial !
    for t, cf in enumerate(flux):
        total += cf / ((1.0 + taux) ** t)
    return total

def calculer_tri(flux, bas=0.0, haut=0.5, tol=1e-6):
    while (haut - bas) > ___:
        milieu = (bas + haut) / 2.0
        if van(flux, milieu) > ___:
            bas = ___
        else:
            haut = ___
    return (bas + haut) / 2.0

flux_projet = [-10000.0, 3500.0, 4000.0, 4500.0]
tri = calculer_tri(flux_projet)
print(f"TRI = {tri:.4%}")`,
      },
    },
    {
      id: "py-prog-17",
      title: "17. Maximum Drawdown en Une Passe O(N) (Algorithme Glissant)",
      category: "financial_econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 18,
      description: "Implémentez l'algorithme linéaire en une passe max_drawdown(prix) maintenant le sommet historique glissant (High-Water Mark) et le pire repli relatif, puis testez-le sur une trajectoire de prix.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : High-Water Mark & Maximum Drawdown (MDD)

#### Intuition Économique & Enjeux de Gestion des Risques
La volatilité $\\sigma$ traite de façon symétrique les hausses et les baisses. En pratique, un comité de risque ou un investisseur dans un fonds CPPI (*Constant Proportion Portfolio Insurance*) s'inquiète surtout de la **perte maximale subie du sommet au creux** (*Maximum Drawdown*, MDD) : c'est le pire scénario qu'aurait subi un investisseur entré au plus mauvais moment (au pic) et sorti au creux suivant.

#### Démonstration Mathématique Formelle
Soit une série de prix ou valeurs liquidatives $(P_0, P_1, \\dots, P_T)$ strictement positifs.

1. **Sommet historique courant (*High-Water Mark*, $M_t$) :**

   $$M_t = \\max_{0 \\le s \\le t} P_s = \\max(M_{t-1}, P_t), \\qquad M_0 = P_0$$

2. **Drawdown instantané ($DD_t \\le 0$) et Maximum Drawdown ($MDD \\le 0$) :**

   $$DD_t = \\frac{P_t - M_t}{M_t} \\le 0, \\qquad MDD = \\min_{0 \\le t \\le T} DD_t$$

Notez la **relation de récurrence** sur $M_t$ : pour connaître le pic à la date $t$, il n'est pas nécessaire de reparcourir tout l'historique $[0, t]$ (ce qui coûterait $O(T^2)$ opérations). Il suffit de comparer $P_t$ au précédent pic $M_{t-1}$ en temps constant $O(1)$, donnant un algorithme global en temps linéaire **$O(T)$** et espace mémoire constant **$O(1)$** !

### 💻 Masterclass Programmation Python : État Glissant en Une Passe ($O(N)$ vs $O(N^2)$)

L'algorithme glissant maintient deux variables d'état initialisées avant la boucle :
- \`pic = prix[0]\` (initialisé au premier prix observé, jamais à \`0.0\` sinon \`dd\` serait faux si tous les prix étaient négatifs ou mal initialisés !)
- \`mdd = 0.0\` (un drawdown est toujours $\\le 0$, donc \`0.0\` est sa borne supérieure exacte).
À chaque itération \`for p in prix:\`:
1. Si \`p > pic\`: mettre à jour \`pic = p\`.
2. Calculer \`dd = (p - pic) / pic\`.
3. Si \`dd < mdd\`: mettre à jour \`mdd = dd\`.

\`\`\`python
# Exemple exécuté : calcul du Maximum Drawdown réel de LVMH ('MC') et BNP sur \`df_marche\`
def mdd_demo(serie_prix):
    pic_courant = serie_prix[0]
    pire_dd = 0.0
    for p in serie_prix:
        if p > pic_courant:
            pic_courant = p
        dd = (p - pic_courant) / pic_courant
        if dd < pire_dd:
            pire_dd = dd
    return pire_dd

for tkr in ['TTE', 'BNP', 'MC', 'AI', 'CW8']:
    px = df_marche.loc[df_marche['ticker'] == tkr, 'prix_cloture'].tolist()
    print(f"{tkr:3s} | Prix : {px} -> MDD = {mdd_demo(px):.2%}")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
TTE | Prix : [61.8, 62.4, 62.0, 63.0, 62.6] -> MDD = -0.64%
BNP | Prix : [62.8, 62.1, 62.7, 63.5, 63.2] -> MDD = -1.11%
MC  | Prix : [738.0, 735.0, 744.0, 752.0, 748.0] -> MDD = -0.53%
AI  | Prix : [176.8, 177.2, 176.5, 178.9, 179.5] -> MDD = -0.40%
CW8 | Prix : [447.5, 448.1, 450.4, 452.8, 453.2] -> MDD = 0.00%
\`\`\`

L'algorithme en une passe détecte en temps linéaire les pires replis intra-semaine (comme \`-1.11%\` sur BNP le 3 janvier ou \`-0.64%\` sur TotalEnergies le 4 janvier, tandis que \`CW8\` monte sans aucun drawdown \`0.00%\`).`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Calculez le Maximum Drawdown négatif $MDD = \\min_t \\frac{P_t - M_t}{M_t} \\le 0$ d'une série de prix en maintenant le *High-Water Mark* glissant $M_t$ en une seule passe $O(N)$ sur la série \`[100.0, 108.0, 95.0, 90.0, 102.0, 112.0]\`.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`def max_drawdown(prix):\`
   - Initialise \`pic = prix[0]\` et \`mdd = 0.0\`.
   - Parcourt \`for p in prix:\`, met à jour \`pic\` si \`p > pic\`, calcule \`dd = (p - pic) / pic\` et met à jour \`mdd\` si \`dd < mdd\`.
   - Retourne \`mdd\` (nombre négatif ou nul, ex : \`-0.1667\` pour $-16.67\\%$).
2. Appelez la fonction sur \`serie = [100.0, 108.0, 95.0, 90.0, 102.0, 112.0]\` et stockez le résultat dans \`mdd_calc\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `def max_drawdown(prix):
    """Calcule le Maximum Drawdown (<= 0) en une passe O(N)."""
    pic = prix[0]
    mdd = 0.0
    for p in prix:
        if p > pic:
            pic = p
        dd = (p - pic) / pic
        if dd < mdd:
            mdd = dd
    return mdd

serie = [100.0, 108.0, 95.0, 90.0, 102.0, 112.0]
mdd_calc = max_drawdown(serie)

print(f"Maximum Drawdown : {mdd_calc:.4%}")`,
      testPythonCode: `assert 'max_drawdown' in globals() and callable(max_drawdown), "La fonction max_drawdown doit être définie."
assert 'mdd_calc' in globals() and abs(mdd_calc - (-18.0 / 108.0)) < 1e-9, "mdd_calc doit valoir (90 - 108) / 108 = -0.166667."
assert abs(max_drawdown([10.0, 12.0, 15.0])) < 1e-12, "Pour une série strictement croissante, max_drawdown doit valoir 0.0."
assert abs(max_drawdown([100.0, 120.0, 60.0]) - (-0.5)) < 1e-9, "Baisse de 120 à 60 -> drawdown de -0.5." `,
      datasets: [],
      hints: [
        "Initialisez pic = prix[0] et mdd = 0.0 avant la boucle for p in prix:.",
        "À chaque prix p : si p > pic, actualisez pic = p ; puis calculez dd = (p - pic) / pic.",
        "Comme dd est <= 0, le pire drawdown est le plus petit : if dd < mdd: mdd = dd.",
      ],
      guide: {
        theoryToPracticeLink: `La relation récursive $M_t = \\max(M_{t-1}, P_t)$ et $MDD = \\min_t \\frac{P_t - M_t}{M_t}$ s'implémente avec deux variables d'état \`pic\` et \`mdd\` mises à jour en une unique boucle \`for p in prix:\`.`,
        stepByStepPlan: [
          "Définir `def max_drawdown(prix):` et initialiser `pic = prix[0]` et `mdd = 0.0`.",
          "Dans `for p in prix:`, actualiser `pic = p` dès que `p > pic`.",
          "Calculer le drawdown courant `dd = (p - pic) / pic` et actualiser `mdd = dd` si `dd < mdd`.",
          "Retourner `mdd` et évaluer `mdd_calc = max_drawdown([100.0, 108.0, 95.0, 90.0, 102.0, 112.0])`.",
        ],
        concepts: [
          {
            symbol: "pic = prix[0]",
            kind: "Variable",
            roleInExercise: "High-Water Mark initialisé au premier prix (jamais à `0`!).",
          },
          {
            symbol: "mdd = 0.0",
            kind: "Variable",
            roleInExercise: "Pire creux négatif enregistré au fil du parcours.",
          },
          {
            symbol: "dd = (p - pic) / pic",
            kind: "Variable",
            roleInExercise: "Drawdown instantané ($\\le 0$) mesurant le repli depuis le pic historique.",
          },
          {
            symbol: "Complexité O(N)",
            kind: "Syntaxe",
            roleInExercise: "Parcours unique sans double boucle imbriquée ni recalcul de `max(prix[:i+1])`.",
          },
          {
            symbol: "mdd_calc",
            kind: "Variable",
            roleInExercise: "Pire drawdown entre le pic `108.0` et le creux `90.0`, soit `-0.166667` (`-16.67%`).",
          },
        ],
        guidedCode: `def max_drawdown(prix):
    pic = prix[___]
    mdd = 0.0
    for p in prix:
        if p > pic:
            pic = ___
        dd = (p - ___) / ___
        if dd < ___:
            mdd = dd
    return mdd

serie = [100.0, 108.0, 95.0, 90.0, 102.0, 112.0]
mdd_calc = max_drawdown(serie)
print(f"MDD = {mdd_calc:.2%}")`,
      },
    },
    {
      id: "py-prog-18",
      title: "18. Variance de Portefeuille par Double Boucle Matricielle (vs NumPy)",
      category: "financial_econometrics",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 20,
      description: "Implémentez le produit quadratique de Markowitz sans NumPy via une double boucle for imbriquée dans variance_portefeuille(w, Sigma), puis vérifiez sa concordance exacte avec w_np @ S_np @ w_np.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Forme Quadratique de Markowitz & Diversification

#### Intuition Économique & Enjeux d'Allocation d'Actifs
Harry Markowitz (Prix Nobel 1990) a montré que le risque d'un portefeuille ne dépend pas de la simple moyenne pondérée des variances individuelles, mais de **toutes les covariances croisées** entre paires d'actifs. Lorsque les actifs sont imparfaitement corrélés ($\\rho_{ij} < 1$), les fluctuations positives de certains titres compensent partiellement les baisses des autres : c'est le gain mathématique de la **diversification**.

#### Démonstration Mathématique Formelle
Soient $N$ actifs de rendements aléatoires $\\mathbf{R} = (R_1, \\dots, R_N)^\\top$, de matrice de variance-covariance $\\Sigma = (\\sigma_{ij})_{1 \\le i, j \\le N}$ symétrique semi-définie positive ($\\sigma_{ii} = \\sigma_i^2$, $\\sigma_{ij} = \\operatorname{Cov}(R_i, R_j)$), et un vecteur de poids $\\mathbf{w} = (w_1, \\dots, w_N)^\\top$. La variance du portefeuille $R_p = \\sum_{i=1}^N w_i R_i$ s'écrit par bilinéarité de la covariance :

$$\\sigma_p^2 = \\operatorname{Var}\\!\\left(\\sum_{i=1}^N w_i R_i\\right) = \\operatorname{Cov}\\!\\left(\\sum_{i=1}^N w_i R_i,\\ \\sum_{j=1}^N w_j R_j\\right) = \\sum_{i=1}^N \\sum_{j=1}^N w_i\\, w_j\\, \\Sigma_{ij} = \\mathbf{w}^\\top \\Sigma \\mathbf{w}$$

En séparant termes diagonaux et hors-diagonaux ($\\Sigma_{ij} = \\Sigma_{ji}$) :

$$\\sigma_p^2 = \\sum_{i=1}^N w_i^2 \\sigma_i^2 + 2 \\sum_{1 \\le i < j \\le N} w_i w_j \\sigma_{ij}$$

### 💻 Masterclass Programmation Python : Double Boucle \`for\` Matricielle vs Algèbre NumPy (\`@\`)

1. **Matrice en pur Python** : une matrice $N \\times N$ se représente par une **liste de listes** \`Sigma = [[...], [...], [...]]\`, où l'élément $(i, j)$ s'indexe \`Sigma[i][j]\`.
2. **Double boucle imbriquée ($O(N^2)$)** :
   \`\`\`python
   n = len(w)
   var = 0.0
   for i in range(n):
       for j in range(n):
           var += w[i] * w[j] * Sigma[i][j]
   \`\`\`
   Pour $N = 3$, le couple $(i, j)$ parcourt exactement $3 \\times 3 = 9$ termes.
3. **Passerelle NumPy (\`@\`)** : en production sur $N = 500$ actions ($250\\,000$ termes), l'opérateur matriciel \`@\` (\`w_np @ S_np @ w_np\`) délègue la double somme à une routine C/BLAS ultra-rapide tout en donnant un résultat numériquement identique à $10^{-15}$ près.

\`\`\`python
import math
import numpy as np

# Exemple exécuté : comparaison portefeuille 2 actifs (actions vs ETF)
w_ex = [0.6, 0.4]
S_ex = [
    [0.0484, 0.0150],  # var1 = 0.22^2 = 0.0484, cov = 0.0150
    [0.0150, 0.0225],  # var2 = 0.15^2 = 0.0225
]
var_py = 0.0
for i in range(len(w_ex)):
    for j in range(len(w_ex)):
        var_py += w_ex[i] * w_ex[j] * S_ex[i][j]

var_np = float(np.array(w_ex) @ np.array(S_ex) @ np.array(w_ex))
vol_naive = w_ex[0] * math.sqrt(S_ex[0][0]) + w_ex[1] * math.sqrt(S_ex[1][1])

print(f"Variance boucle Python : {var_py:.8f} | Variance NumPy (@) : {var_np:.8f}")
print(f"Volatilité diversifiée : {math.sqrt(var_py):.2%} vs moyenne pondérée sans diversification : {vol_naive:.2%}")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Variance boucle Python : 0.02822400 | Variance NumPy (@) : 0.02822400
Volatilité diversifiée : 16.80% vs moyenne pondérée sans diversification : 19.20%
\`\`\`

La volatilité réelle du portefeuille ($16.80\\%$) est nettement inférieure à la moyenne pondérée des volatilités ($19.20\\%$), prouvant le gain de diversification apporté par les termes croisés de la matrice $\\Sigma$.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Implémentez la forme quadratique $\\sigma_p^2 = \\sum_{i=0}^{2}\\sum_{j=0}^{2} w_i w_j \\Sigma_{ij}$ en pur Python pour le portefeuille \`w = [0.5, 0.3, 0.2]\` et la matrice de covariance $3 \\times 3$ :
\`Sigma = [[0.04, 0.012, 0.008], [0.012, 0.09, 0.015], [0.008, 0.015, 0.0225]]\`, puis comparez avec l'algèbre matricielle NumPy.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`def variance_portefeuille(w, Sigma):\` calculant $\\sum_i \\sum_j w_i w_j \\Sigma_{ij}$ par double boucle \`for\` **sans utiliser NumPy à l'intérieur**.
2. \`w = [0.5, 0.3, 0.2]\` et \`Sigma = [[0.04, 0.012, 0.008], [0.012, 0.09, 0.015], [0.008, 0.015, 0.0225]]\`
3. \`var_boucle = variance_portefeuille(w, Sigma)\`
4. \`w_np = np.array(w)\`, \`S_np = np.array(Sigma)\` et \`var_numpy = float(w_np @ S_np @ w_np)\` (après \`import numpy as np\`).
5. Affichez \`var_boucle\` et \`var_numpy\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `import numpy as np

def variance_portefeuille(w, Sigma):
    """Calcule w^T Sigma w par double boucle for en pur Python."""
    n = len(w)
    variance = 0.0
    for i in range(n):
        for j in range(n):
            variance += w[i] * w[j] * Sigma[i][j]
    return variance

w = [0.5, 0.3, 0.2]
Sigma = [
    [0.04,  0.012, 0.008],
    [0.012, 0.09,  0.015],
    [0.008, 0.015, 0.0225],
]

var_boucle = variance_portefeuille(w, Sigma)
w_np = np.array(w)
S_np = np.array(Sigma)
var_numpy = float(w_np @ S_np @ w_np)

print(f"Variance (double boucle) : {var_boucle:.8f}")
print(f"Variance (NumPy @)       : {var_numpy:.8f}")`,
      testPythonCode: `import numpy as np
assert 'variance_portefeuille' in globals() and callable(variance_portefeuille), "La fonction variance_portefeuille doit être définie."
assert 'var_boucle' in globals() and abs(var_boucle - 0.026) < 1e-9, "var_boucle attendue : 0.026."
assert 'var_numpy' in globals() and abs(var_boucle - var_numpy) < 1e-12, "var_boucle et var_numpy doivent concorder à 1e-12 près."
assert 'w_np' in globals() and 'S_np' in globals(), "Définissez w_np = np.array(w) et S_np = np.array(Sigma)."
assert abs(variance_portefeuille([1.0, 0.0], [[0.04, 0.01], [0.01, 0.09]]) - 0.04) < 1e-9, "variance_portefeuille doit être générique pour toute dimension n." `,
      datasets: [],
      hints: [
        "Dans variance_portefeuille(w, Sigma), posez n = len(w) et variance = 0.0.",
        "Imbriquez deux boucles : for i in range(n): puis for j in range(n): variance += w[i] * w[j] * Sigma[i][j].",
        "Pour comparer avec NumPy : w_np = np.array(w), S_np = np.array(Sigma), var_numpy = float(w_np @ S_np @ w_np).",
      ],
      guide: {
        theoryToPracticeLink: `La double somme $\\sum_{i=0}^{n-1} \\sum_{j=0}^{n-1} w_i w_j \\Sigma_{ij}$ correspond mot pour mot à deux boucles \`for i in range(n):\` / \`for j in range(n):\` indexant \`Sigma[i][j]\`, dont le résultat égale exactement \`w_np @ S_np @ w_np\`.`,
        stepByStepPlan: [
          "Importer `numpy as np` pour la comparaison finale.",
          "Définir `def variance_portefeuille(w, Sigma):` avec double boucle `for i in range(n): for j in range(n):`.",
          "Définir `w` et `Sigma` puis calculer `var_boucle = variance_portefeuille(w, Sigma)`.",
          "Convertir en `w_np = np.array(w)` et `S_np = np.array(Sigma)` puis calculer `var_numpy = float(w_np @ S_np @ w_np)`.",
        ],
        concepts: [
          {
            symbol: "Sigma[i][j]",
            kind: "Syntaxe",
            roleInExercise: "Accès à l'élément ligne `i`, colonne `j` d'une matrice représentée en liste de listes.",
          },
          {
            symbol: "Double boucle for",
            kind: "Syntaxe",
            roleInExercise: "Parcourt les $n^2$ paires d'indices $(i, j)$ en complexité $O(n^2)$.",
          },
          {
            symbol: "variance_portefeuille",
            kind: "Fonction / Méthode",
            roleInExercise: "Calcule la forme quadratique $\\mathbf{w}^\\top \\Sigma \\mathbf{w}$ sans dépendance externe.",
          },
          {
            symbol: "@",
            kind: "Syntaxe",
            roleInExercise: "Opérateur Python de multiplication matricielle pour tableaux NumPy (`w_np @ S_np @ w_np`).",
          },
          {
            symbol: "var_boucle / var_numpy",
            kind: "Variable",
            roleInExercise: "Variances obtenues (`0.026`, soit une volatilité de $16.12\\%$).",
          },
        ],
        guidedCode: `import numpy as np

def variance_portefeuille(w, Sigma):
    n = len(w)
    variance = 0.0
    for i in range(n):
        for j in range(n):
            variance += w[___] * w[___] * Sigma[___][___]
    return variance

w = [0.5, 0.3, 0.2]
Sigma = [
    [0.04,  0.012, 0.008],
    [0.012, 0.09,  0.015],
    [0.008, 0.015, 0.0225],
]

var_boucle = variance_portefeuille(w, Sigma)
w_np = np.array(w)
S_np = np.array(Sigma)
var_numpy = float(w_np @ ___ @ w_np)

print(var_boucle, var_numpy)`,
      },
    },
    {
      id: "py-prog-19",
      title: "19. Tableau d'Amortissement Structuré (Liste de Dicts -> DataFrame)",
      category: "alm",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 20,
      description: "Construisez un tableau d'amortissement à annuité constante dans generer_echeancier(capital, taux, duree) en produisant une liste de duree dictionnaires, puis convertissez-la en DataFrame Pandas.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Amortissement à Annuité Constante & Profil ALM

#### Intuition Économique & Enjeux Bancaires
Un prêt immobilier ou un crédit amortissable classique à taux fixe rembourse chaque période une **annuité totale constante** $A$, décomposée entre le paiement des **intérêts** sur le capital restant dû en début de période ($I_t$) et le **remboursement du principal** ($M_t$).

En début de prêt, la dette restante est élevée : les intérêts absorbent l'essentiel de l'annuité et le capital s'amortit lentement. À mesure que la dette diminue, les intérêts baissent et la part d'amortissement accélère jusqu'à solder exactement le capital à la dernière échéance ($CRD_N = 0$). En ALM bancaire, ce tableau d'échéancier détermine le profil d'écoulement des encours (*run-off profile*).

#### Démonstration Mathématique Formelle
Soit un capital emprunté $K > 0$ au taux périodique $r > 0$ sur $N \\in \\mathbb{N}^*$ périodes. La somme actualisée des $N$ annuités constantes $A$ doit égaler $K$ :

$$K = \\sum_{t=1}^N \\frac{A}{(1 + r)^t} = A \\cdot \\frac{1 - (1 + r)^{-N}}{r} \\implies A = K \\cdot \\frac{r}{1 - (1 + r)^{-N}}$$

À chaque période $t = 1, \\dots, N$, à partir de $CRD_0 = K$ :

$$I_t = CRD_{t-1} \\cdot r, \\qquad M_t = A - I_t, \\qquad CRD_t = CRD_{t-1} - M_t$$

Par télescopage arithmétique, $\\sum_{t=1}^N M_t = CRD_0 - CRD_N = K$, garantissant un capital restant dû final nul ($CRD_N = 0$).

### 💻 Masterclass Programmation Python : État Séquentiel, \`list[dict]\` & Conversion \`pd.DataFrame\`

Construire une table financière ligne par ligne en pur Python suit un motif extrêmement puissant :
1. **État glissant** : initialiser \`crd = float(capital)\` avant la boucle \`for annee in range(1, duree + 1):\`.
2. **Enregistrement structuré** : à chaque année, calculer \`interets\`, \`amortissement\`, \`crd_fin = max(0.0, crd - amortissement)\` (le \`max(0.0, ...)\` neutralise un éventuel résidu flottant négatif comme \`-1.45e-11\` sur la dernière ligne), puis ajouter un dictionnaire dans \`lignes.append({...})\` et mettre à jour \`crd = crd_fin\`.
3. **Passerelle directe vers Pandas** : \`pd.DataFrame(liste_de_dicts)\` transforme instantanément votre liste de dictionnaires en DataFrame avec les clés comme noms de colonnes !

\`\`\`python
import pandas as pd

# Exemple exécuté : prêt 3 ans de 30 000 EUR à 3.5%
def demo_amort(K, r, N):
    ann = K * r / (1.0 - (1.0 + r) ** (-N))
    crd = K
    rows = []
    for t in range(1, N + 1):
        interet = crd * r
        amort = ann - interet
        crd_fin = max(0.0, crd - amort)
        rows.append({'annee': t, 'crd_debut': crd, 'interets': interet,
                     'amortissement': amort, 'crd_fin': crd_fin})
        crd = crd_fin
    return rows

df_demo = pd.DataFrame(demo_amort(30_000.0, 0.035, 3))
print(df_demo.round(2).to_string(index=False))
print(f"Somme exacte des amortissements : {df_demo['amortissement'].sum():.2f} EUR")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
 annee  crd_debut  interets  amortissement  crd_fin
     1   30000.00   1050.00        9658.03 20341.97
     2   20341.97    711.97        9996.06 10345.92
     3   10345.92    362.11       10345.92     0.00
Somme exacte des amortissements : 30000.00 EUR
\`\`\`

On vérifie visuellement le mécanisme bancaire classique : les intérêts décroissent de \`1050.00\` à \`362.11 EUR\` tandis que le capital amorti augmente symétriquement jusqu'à solder le prêt à \`0.00 EUR\`.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Pour un emprunt de \`100 000 EUR\` sur \`5\` ans au taux annuel de \`4%\` (\`0.04\`), calculez l'annuité constante $A = K \\frac{r}{1 - (1+r)^{-N}}$ et générez l'échéancier complet vérifiant $\\sum M_t = 100\\,000\\text{ EUR}$ et $CRD_5 = 0$.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`def generer_echeancier(capital, taux, duree):\`
   - Retourne une liste de \`duree\` dictionnaires comportant chacun les **6 clés exactes** : \`'annee'\` (\`1..duree\`), \`'crd_debut'\`, \`'annuite'\`, \`'interets'\`, \`'amortissement'\`, \`'crd_fin'\`.
   - (Si \`taux == 0\`, prévoyez \`annuite = capital / duree\` ; utilisez \`max(0.0, crd - amortissement)\` pour éviter un \`-1e-11\` final).
2. Appelez \`echeancier = generer_echeancier(100000.0, 0.04, 5)\`.
3. Convertissez le résultat en DataFrame Pandas : \`df_echeancier = pd.DataFrame(echeancier)\` et affichez-le.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `import pandas as pd

def generer_echeancier(capital, taux, duree):
    """Génère un tableau d'amortissement à annuité constante (liste de dicts)."""
    if taux == 0:
        annuite = capital / duree
    else:
        annuite = capital * taux / (1.0 - (1.0 + taux) ** (-duree))

    crd = float(capital)
    echeancier = []
    for annee in range(1, duree + 1):
        interets = crd * taux
        amortissement = annuite - interets
        crd_fin = max(0.0, crd - amortissement)
        echeancier.append({
            'annee': annee,
            'crd_debut': crd,
            'annuite': annuite,
            'interets': interets,
            'amortissement': amortissement,
            'crd_fin': crd_fin,
        })
        crd = crd_fin

    return echeancier

echeancier = generer_echeancier(100000.0, 0.04, 5)
df_echeancier = pd.DataFrame(echeancier)

print(df_echeancier.round(2).to_string(index=False))`,
      testPythonCode: `import pandas as pd
assert 'generer_echeancier' in globals() and callable(generer_echeancier), "La fonction generer_echeancier doit être définie."
assert 'echeancier' in globals() and isinstance(echeancier, list) and len(echeancier) == 5, "echeancier doit contenir 5 dictionnaires."
assert 'df_echeancier' in globals() and isinstance(df_echeancier, pd.DataFrame) and len(df_echeancier) == 5, "df_echeancier doit être un DataFrame de 5 lignes."
cols_req = {'annee', 'crd_debut', 'annuite', 'interets', 'amortissement', 'crd_fin'}
assert cols_req.issubset(set(df_echeancier.columns)), f"Colonnes manquantes dans df_echeancier : {cols_req - set(df_echeancier.columns)}."
assert abs(df_echeancier['interets'].iloc[0] - 4000.0) < 1e-4, "Les intérêts de l'année 1 doivent valoir 100000 * 0.04 = 4000.0."
assert abs(df_echeancier['amortissement'].sum() - 100000.0) < 1e-4, "La somme des amortissements doit égaler le capital 100000.0."
assert abs(df_echeancier['crd_fin'].iloc[-1]) < 1e-6, "Le CRD final doit être nul (< 1e-6)." `,
      datasets: [],
      hints: [
        "Calculez l'annuité constante avant la boucle : annuite = capital * taux / (1.0 - (1.0 + taux) ** (-duree)).",
        "Initialisez crd = float(capital) et echeancier = [], puis bouclez sur for annee in range(1, duree + 1):.",
        "À chaque itération, calculez interets = crd * taux, amortissement = annuite - interets, crd_fin = max(0.0, crd - amortissement), ajoutez le dict, puis mettez à jour crd = crd_fin.",
      ],
      guide: {
        theoryToPracticeLink: `La récurrence bancaire $(I_t, M_t, CRD_t)$ alimente à chaque tour de boucle \`for annee in range(1, duree + 1):\` un dictionnaire structuré qui est directement transformé en tableau analytique par \`pd.DataFrame(echeancier)\`.`,
        stepByStepPlan: [
          "Importer `pandas as pd`.",
          "Calculer l'annuité constante `annuite` en début de `generer_echeancier`.",
          "Initialiser `crd = float(capital)` et `echeancier = []`, puis itérer sur `range(1, duree + 1)` pour ajouter les 6 clés requises et actualiser `crd = crd_fin`.",
          "Appeler `echeancier = generer_echeancier(100000.0, 0.04, 5)` puis créer `df_echeancier = pd.DataFrame(echeancier)`.",
        ],
        concepts: [
          {
            symbol: "generer_echeancier",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction construisant une liste de dictionnaires ligne par ligne.",
          },
          {
            symbol: "annuite",
            kind: "Variable",
            roleInExercise: "Annuité constante calculée par la formule de rente finie ($22\\,462.71\\text{ EUR}$).",
          },
          {
            symbol: "crd / crd_fin",
            kind: "Variable",
            roleInExercise: "Variable d'état suivant le Capital Restant Dû d'une année à la suivante jusqu'à `0.0`.",
          },
          {
            symbol: "pd.DataFrame(echeancier)",
            kind: "Fonction / Méthode",
            roleInExercise: "Convertit instantanément une `list[dict]` en tableau Pandas exploitable.",
          },
          {
            symbol: "max(0.0, ...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Évite qu'un résidu flottant comme `-1e-11` n'apparaisse comme CRD final négatif.",
          },
        ],
        guidedCode: `import pandas as pd

def generer_echeancier(capital, taux, duree):
    annuite = capital * taux / (1.0 - (1.0 + taux) ** (-___))
    crd = float(capital)
    echeancier = []

    for annee in range(1, duree + 1):
        interets = crd * ___
        amortissement = annuite - ___
        crd_fin = max(0.0, crd - ___)
        echeancier.append({
            'annee': annee,
            'crd_debut': crd,
            'annuite': annuite,
            'interets': interets,
            'amortissement': amortissement,
            'crd_fin': crd_fin,
        })
        crd = ___

    return echeancier

echeancier = generer_echeancier(100000.0, 0.04, 5)
df_echeancier = pd.DataFrame(echeancier)
print(df_echeancier.round(2))`,
      },
    },
    {
      id: "py-prog-20",
      title: "20. Simulation Monte Carlo en Pur Python : Mouvement Brownien Géométrique (GBM)",
      category: "monte_carlo",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 22,
      description: "Implémentez un simulateur Monte Carlo en pur Python (random.gauss et boucle for) dans simuler_gbm(S0, mu, sigma, T, N) pour générer 2 000 trajectoires terminales et vérifier l'espérance théorique.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Mouvement Brownien Géométrique & Correction d'Itô ($-\\frac{1}{2}\\sigma^2$)

#### Intuition Économique & Enjeux Quantitatifs
Le modèle de Black-Scholes-Merton (1973) modélise l'évolution d'un actif risqué $S_t$ (indice CAC 40, action, fonds en unités de compte) par un **Mouvement Brownien Géométrique (GBM)** : les chocs aléatoires sont proportionnels au prix courant, ce qui garantit que le prix reste **toujours strictement positif** ($S_t > 0$, responsabilité limitée de l'actionnaire).

Pour simuler ce processus par **méthode de Monte Carlo**, on génère $N$ tirages gaussiens indépendants et on observe que leur moyenne empirique converge vers l'espérance théorique $S_0 e^{\\mu T}$ à vitesse $O(1/\\sqrt{N})$ (Loi des Grands Nombres et Théorème Central Limite).

#### Démonstration Mathématique Formelle
L'équation différentielle stochastique du GBM s'écrit :

$$dS_t = \\mu S_t\\, dt + \\sigma S_t\\, dW_t$$

où $W_t$ est un mouvement brownien standard. En posant $f(S_t) = \\ln S_t$ ($f'(S) = 1/S$, $f''(S) = -1/S^2$), le **lemme d'Itô** donne :

$$d(\\ln S_t) = \\frac{1}{S_t} dS_t + \\frac{1}{2}\\left(-\\frac{1}{S_t^2}\\right)(dS_t)^2 = \\left(\\mu - \\frac{1}{2}\\sigma^2\\right) dt + \\sigma\\, dW_t$$

En intégrant exactement de $0$ à $T$ (sans erreur de discrétisation !), sachant que $W_T \\sim \\mathcal{N}(0, T) \\stackrel{d}{=} \\sqrt{T}\\, Z$ avec $Z \\sim \\mathcal{N}(0, 1)$ :

$$S_T = S_0 \\exp\\!\\left(\\left(\\mu - \\frac{1}{2}\\sigma^2\\right)T + \\sigma \\sqrt{T}\\, Z\\right)$$

**Preuve de l'espérance :** Comme $\\mathbb{E}[e^{\\sigma\\sqrt{T}Z}] = e^{\\frac{1}{2}\\sigma^2 T}$ (fonction génératrice des moments d'une loi normale), le terme $-\\frac{1}{2}\\sigma^2 T$ se compense exactement pour assurer $\\mathbb{E}[S_T] = S_0 e^{\\mu T}$ !

### 💻 Masterclass Programmation Python : Modules \`random\` & \`math\`, Graine \`seed(42)\` & Boucle de Simulation

En pur Python (avant la vectorisation NumPy), la bibliothèque standard fournit tout le nécessaire :
1. **\`random.seed(42)\`** : fixe l'état du générateur pseudo-aléatoire Mersenne Twister afin que l'expérience soit **100 % reproductible** lors de l'audit ou de la validation.
2. **\`random.gauss(0, 1)\`** : tire à chaque tour de boucle un réel suivant la loi normale centrée réduite $\\mathcal{N}(0, 1)$.
3. **Pré-calcul des constantes hors boucle** : calculer \`drift = (mu - 0.5 * sigma ** 2) * T\` et \`vol_sqrt_t = sigma * math.sqrt(T)\` *avant* le \`for _ in range(N):\` évite de recalculer \`math.sqrt(T)\` $N = 2\\,000$ fois inutilement !

\`\`\`python
import math
import random

# Exemple exécuté : convergence de Monte Carlo sur un actif S0=100, mu=5%, sigma=20%, T=1 an
def mc_gbm_demo(S0, mu, sigma, T, N):
    drift = (mu - 0.5 * sigma ** 2) * T
    diff = sigma * math.sqrt(T)
    return [S0 * math.exp(drift + diff * random.gauss(0, 1)) for _ in range(N)]

cible_theorique = 100.0 * math.exp(0.05)
for N_sim in [100, 1_000, 10_000]:
    random.seed(42)
    sim = mc_gbm_demo(100.0, 0.05, 0.20, 1.0, N_sim)
    moy = sum(sim) / len(sim)
    print(f"N={N_sim:5d} | Moyenne MC = {moy:7.4f} EUR | Cible théorique = {cible_theorique:7.4f} EUR | Écart = {moy - cible_theorique:+.4f}")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
N=  100 | Moyenne MC = 105.8579 EUR | Cible théorique = 105.1271 EUR | Écart = +0.7308
N= 1000 | Moyenne MC = 104.8370 EUR | Cible théorique = 105.1271 EUR | Écart = -0.2901
N=10000 | Moyenne MC = 104.8807 EUR | Cible théorique = 105.1271 EUR | Écart = -0.2464
\`\`\`

L'erreur d'estimation se réduit nettement lorsque $N$ augmente de $100$ à $10\\,000$ tirages, illustrant la convergence $O(1/\\sqrt{N})$ de Monte Carlo.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Simulez $N = 2\\,000$ prix terminaux à $T = 1.0$ an pour $S_0 = 100.0\\text{ EUR}$, $\\mu = 5\\%$ ($0.05$) et $\\sigma = 20\\%$ ($0.20$) selon la solution exacte $S_T = S_0 \\exp\\!\\left((\\mu - \\frac{1}{2}\\sigma^2)T + \\sigma\\sqrt{T}Z\\right)$ avec $Z \\sim \\mathcal{N}(0, 1)$, et comparez la moyenne simulée à $S_0 e^{\\mu T} \\approx 105.13\\text{ EUR}$.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. Importez \`random\` et \`math\`.
2. Écrivez \`def simuler_gbm(S0, mu, sigma, T, N):\` qui génère par boucle \`for\` (avec \`random.gauss(0, 1)\` et \`math.exp\`, \`math.sqrt\`) et retourne la liste des \`N\` prix simulés.
3. Fixez la graine \`random.seed(42)\`, puis appelez \`prix_simules = simuler_gbm(100.0, 0.05, 0.20, 1.0, 2000)\`.
4. Calculez \`moy_simul = sum(prix_simules) / len(prix_simules)\` et affichez le résultat.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `import math
import random

def simuler_gbm(S0, mu, sigma, T, N):
    """Simule N prix terminaux d'un Mouvement Brownien Géométrique en pur Python."""
    drift = (mu - 0.5 * (sigma ** 2)) * T
    vol_t = sigma * math.sqrt(T)
    resultats = []
    for _ in range(N):
        z = random.gauss(0.0, 1.0)
        st = S0 * math.exp(drift + vol_t * z)
        resultats.append(st)
    return resultats

random.seed(42)
prix_simules = simuler_gbm(100.0, 0.05, 0.20, 1.0, 2000)
moy_simul = sum(prix_simules) / len(prix_simules)

print(f"Nombre de trajectoires : {len(prix_simules)}")
print(f"Moyenne simulée : {moy_simul:.4f} EUR (théorique : {100.0 * math.exp(0.05):.4f} EUR)")`,
      testPythonCode: `import math
assert 'simuler_gbm' in globals() and callable(simuler_gbm), "La fonction simuler_gbm doit être définie."
assert 'prix_simules' in globals() and isinstance(prix_simules, list) and len(prix_simules) == 2000, "prix_simules doit être une liste de 2000 floats."
assert all(p > 0 for p in prix_simules), "Tous les prix GBM simulés doivent être strictement positifs."
assert 'moy_simul' in globals() and abs(moy_simul - sum(prix_simules) / 2000) < 1e-9, "moy_simul doit égaler la moyenne de prix_simules."
assert abs(moy_simul - 100.0 * math.exp(0.05)) < 2.5, "moy_simul s'écarte trop de l'espérance théorique (~105.13) : vérifiez la formule d'Itô (-0.5 * sigma**2)."
det = simuler_gbm(120.0, 0.03, 0.0, 2.0, 5)
assert len(det) == 5 and abs(det[0] - 120.0 * math.exp(0.06)) < 1e-9, "Avec sigma=0, la fonction doit retourner S0 * exp(mu * T)." `,
      datasets: [],
      hints: [
        "Importez math et random. Pré-calculez drift = (mu - 0.5 * (sigma ** 2)) * T et vol_t = sigma * math.sqrt(T).",
        "Dans une boucle for _ in range(N):, tirez z = random.gauss(0, 1) et ajoutez S0 * math.exp(drift + vol_t * z) à votre liste.",
        "Appelez random.seed(42) juste avant prix_simules = simuler_gbm(100.0, 0.05, 0.20, 1.0, 2000), puis moy_simul = sum(prix_simules) / len(prix_simules).",
      ],
      guide: {
        theoryToPracticeLink: `La solution fermée d'Itô $S_T = S_0 \\exp((\\mu - \\frac{1}{2}\\sigma^2)T + \\sigma\\sqrt{T}Z)$ se traduit directement dans une boucle \`for _ in range(N):\` alimentée par \`random.gauss(0, 1)\` après fixation de la graine \`random.seed(42)\`.`,
        stepByStepPlan: [
          "Importer `math` et `random`.",
          "Définir `def simuler_gbm(S0, mu, sigma, T, N):` en pré-calculant `drift` et `vol_t` hors boucle.",
          "Boucler `N` fois avec `random.gauss(0.0, 1.0)` pour remplir `resultats` via `.append(...)` et retourner la liste.",
          "Fixer `random.seed(42)`, générer `prix_simules` (`N=2000`) et calculer `moy_simul`.",
        ],
        concepts: [
          {
            symbol: "random.seed(42)",
            kind: "Fonction / Méthode",
            roleInExercise: "Initialise le générateur aléatoire pour rendre la simulation reproductible.",
          },
          {
            symbol: "random.gauss(0, 1)",
            kind: "Fonction / Méthode",
            roleInExercise: "Tire une réalisation gaussienne standard $Z \\sim \\mathcal{N}(0, 1)$.",
          },
          {
            symbol: "- 0.5 * sigma**2",
            kind: "Syntaxe",
            roleInExercise: "Correction de convexité d'Itô indispensable pour que $\\mathbb{E}[S_T] = S_0 e^{\\mu T}$.",
          },
          {
            symbol: "simuler_gbm",
            kind: "Fonction / Méthode",
            roleInExercise: "Génère et retourne la liste des `N` prix terminaux simulés.",
          },
          {
            symbol: "prix_simules / moy_simul",
            kind: "Variable",
            roleInExercise: "Liste des `2000` prix et leur moyenne empirique (~`104.77 EUR`).",
          },
        ],
        guidedCode: `import math
import random

def simuler_gbm(S0, mu, sigma, T, N):
    drift = (mu - 0.5 * (sigma ** 2)) * ___
    vol_t = sigma * math.sqrt(___)
    resultats = []
    for _ in range(N):
        z = random.gauss(0.0, 1.0)
        st = S0 * math.exp(drift + vol_t * ___)
        resultats.append(st)
    return resultats

random.seed(42)
prix_simules = simuler_gbm(100.0, 0.05, 0.20, 1.0, ___)
moy_simul = sum(prix_simules) / len(prix_simules)
print(f"Moyenne simulée : {moy_simul:.4f} EUR")`,
      },
    },
    {
      id: "py-prog-21",
      title: "21. Algorithme GROUP BY & Jointure à la Main (Dicts Accumulateurs)",
      category: "data_prep",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 22,
      description: "Reproduisez en pur Python un LEFT JOIN + GROUP BY SQL en parcourant df_assures.to_dict('records') et df_sinistres.to_dict('records') sans fan-out pour construire primes_par_region, sinistres_par_region et sp_par_region.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Algorithme Hash-Join / Hash-Aggregate & Anti-Fan-Out Relationnel

#### Intuition Économique & Enjeux d'Ingénierie des Données Actuarielles
Comment un moteur SQL (\`GROUP BY\`, \`LEFT JOIN\`) ou Pandas (\`.groupby()\`, \`.merge()\`) exécute-t-il ses agrégations sous le capot ? Il utilise exactement des **tables de hachage** (dictionnaires Python !) :
1. Une table d'indexation associant chaque clé primaire (\`police_id\`) à son attribut de regroupement (\`region\`).
2. Des dictionnaires accumulateurs cumulant les sommes par clé de groupe (\`region\`).

En assurance IARD, les tables \`df_assures\` (12 polices) et \`df_sinistres\` (8 sinistres) ont une cardinalité **1-à-N** (la police \`1003\` a $2$ sinistres, et $5$ polices ont $0$ sinistre). Un double \`for\` naïf qui additionnerait la \`prime_annuelle\` à chaque paire \`(police, sinistre)\` commettrait le fameux bug du **fan-out** (comptant la prime de la police \`1003\` deux fois et oubliant les polices à $0$ sinistre !). L'algorithme propre en **deux boucles séquentielles** agrège chaque table à sa propre granularité.

#### Démonstration Mathématique Formelle
Soit $\\mathcal{P}$ l'ensemble des polices partitionné par région $g \\in \\mathcal{G}$ ($\\mathcal{P}_g = \\{ i \\in \\mathcal{P} : \\text{region}(i) = g \\}$), et $\\mathcal{S}$ l'ensemble des dossiers de sinistres rattachés à une police $\\text{pol}(j) \\in \\mathcal{P}$ :

$$P_g = \\sum_{i \\in \\mathcal{P}_g} \\text{prime}_i, \\qquad S_g = \\sum_{\\substack{j \\in \\mathcal{S} \\\\ \\text{region}(\\text{pol}(j)) = g}} \\text{cout}_j, \\qquad (S/P)_g = \\frac{S_g}{P_g}$$

Pour toute région $g$ sans aucun dossier dans $\\mathcal{S}$, la somme vide vaut $S_g = 0$ (sémantique du \`LEFT JOIN\`), et non une exclusion du dictionnaire. Complexité temporelle : $O(|\\mathcal{P}| + |\\mathcal{S}|)$ grâce aux accès dictionnaire en $O(1)$, au lieu de $O(|\\mathcal{P}| \\times |\\mathcal{S}|)$ !

### 💻 Masterclass Programmation Python : \`.to_dict('records')\`, \`.get(cle, 0.0)\` & Indexation par \`dict\`

Trois outils Python rendent cet algorithme limpide :
1. **\`df.to_dict('records')\`** : convertit un DataFrame en une liste Python standard de dictionnaires (1 dict par ligne).
2. **\`d[cle] = d.get(cle, 0.0) + val\`** : motif idiomatique d'accumulation par groupe en 1 ligne ! Si \`cle\` n'est pas encore dans \`d\`, \`.get(cle, 0.0)\` renvoie \`0.0\`, évitant un \`KeyError\`.
3. **Dictionnaire d'indexation \`police_to_region\`** : construit durant la boucle sur \`df_assures\`, il relie en $O(1)$ chaque sinistre à la région de sa police dans la seconde boucle !

\`\`\`python
# Exemple exécuté : reproduction d'un GROUP BY par type_contrat sur df_assures
comptage_contrat = {}
primes_contrat = {}

for row in df_assures.to_dict('records'):
    tc = row['type_contrat']
    comptage_contrat[tc] = comptage_contrat.get(tc, 0) + 1
    primes_contrat[tc] = primes_contrat.get(tc, 0.0) + float(row['prime_annuelle'])

for tc in comptage_contrat:
    prime_moy = primes_contrat[tc] / comptage_contrat[tc]
    print(f"{tc:15s} | Polices : {comptage_contrat[tc]:2d} | Primes totales : {primes_contrat[tc]:8.2f} EUR | Moy : {prime_moy:6.2f} EUR")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Tous Risques    | Polices :  7 | Primes totales :  7481.80 EUR | Moy : 1068.83 EUR
Tiers Étendu    | Polices :  3 | Primes totales :  1755.00 EUR | Moy : 585.00 EUR
Tiers Simple    | Polices :  2 | Primes totales :  2070.00 EUR | Moy : 1035.00 EUR
\`\`\`

Sans jamais appeler \`.groupby()\`, ces quelques lignes de Python pur reproduisent exactement un \`SELECT type_contrat, COUNT(*), SUM(prime_annuelle), AVG(prime_annuelle) FROM assures GROUP BY type_contrat;\`.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
À partir des tables préchargées \`df_assures\` (12 polices) et \`df_sinistres\` (8 sinistres), reproduisez manuellement un \`LEFT JOIN\` + \`GROUP BY region\` **sans fan-out** en utilisant exclusivement des boucles \`for\` et des dictionnaires accumulateurs sur \`.to_dict('records')\` (sans appeler \`.groupby()\` ni \`pd.merge()\`).

**Volet 2 — Laboratoire Pratique Python :**
Construisez exactement les 3 dictionnaires suivants à l'aide de boucles sur \`df_assures.to_dict('records')\` et \`df_sinistres.to_dict('records')\` :
1. \`primes_par_region\` (\`dict\`) : total des \`prime_annuelle\` par \`region\` (9 régions, total global \`11 306.80 EUR\`).
2. \`sinistres_par_region\` (\`dict\`) : total des \`cout_total\` des sinistres rattachés à chaque \`region\` via un dictionnaire intermédiaire \`police_region\` (\`police_id -> region\`), avec \`0.0\` pour les régions sans sinistre (total global \`48 950.00 EUR\`).
3. \`sp_par_region\` (\`dict\`) : ratio S/P décimal \`sinistres_par_region[r] / primes_par_region[r]\` pour chacune des 9 régions.
4. Affichez les 3 dictionnaires.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `primes_par_region = {}
sinistres_par_region = {}
police_region = {}

# Boucle 1 : agrégation des primes et indexation police_id -> region (sans fan-out)
for row in df_assures.to_dict('records'):
    reg = row['region']
    pid = row['police_id']
    primes_par_region[reg] = primes_par_region.get(reg, 0.0) + float(row['prime_annuelle'])
    police_region[pid] = reg
    if reg not in sinistres_par_region:
        sinistres_par_region[reg] = 0.0

# Boucle 2 : agrégation des sinistres rattachés à la région via police_region
for sin in df_sinistres.to_dict('records'):
    reg = police_region.get(sin['police_id'])
    if reg is not None:
        sinistres_par_region[reg] += float(sin['cout_total'])

# Calcul du ratio S/P par région
sp_par_region = {
    reg: sinistres_par_region[reg] / primes_par_region[reg]
    for reg in primes_par_region
}

for reg in sorted(sp_par_region, key=sp_par_region.get, reverse=True):
    print(f"{reg:20s} | Primes={primes_par_region[reg]:8.2f} | Sinistres={sinistres_par_region[reg]:8.2f} | S/P={sp_par_region[reg]:.2%}")`,
      testPythonCode: `assert 'primes_par_region' in globals() and isinstance(primes_par_region, dict), "primes_par_region doit être un dictionnaire."
assert 'sinistres_par_region' in globals() and isinstance(sinistres_par_region, dict), "sinistres_par_region doit être un dictionnaire."
assert 'sp_par_region' in globals() and isinstance(sp_par_region, dict), "sp_par_region doit être un dictionnaire."
assert len(primes_par_region) == 9, "Il doit y avoir exactement 9 régions dans primes_par_region."
assert len(sinistres_par_region) == 9, "Toutes les 9 régions (y compris celles à 0 sinistre) doivent figurer dans sinistres_par_region."
assert abs(sum(primes_par_region.values()) - 11306.80) < 1e-4, "Total des primes incorrect (attention au fan-out : attendu 11306.80)."
assert abs(sum(sinistres_par_region.values()) - 48950.0) < 1e-4, "Total des sinistres incorrect (attendu 48950.0)."
assert abs(primes_par_region['IDF'] - 5210.70) < 1e-4, "Primes IDF attendues : 5210.70."
assert abs(sinistres_par_region['IDF'] - 33750.0) < 1e-4, "Sinistres IDF attendus : 33750.0."
assert abs(primes_par_region['PACA'] - 1150.0) < 1e-4 and abs(sinistres_par_region['PACA'] - 5420.0) < 1e-4, "Valeurs PACA incorrectes."
assert sinistres_par_region['Bretagne'] == 0.0 and sp_par_region['Bretagne'] == 0.0, "Bretagne (0 sinistre) doit avoir 0.0." `,
      datasets: [],
      hints: [
        "Parcourez d'abord df_assures.to_dict('records') pour cumuler primes_par_region[reg] = primes_par_region.get(reg, 0.0) + row['prime_annuelle'] et enregistrer police_region[row['police_id']] = reg.",
        "Dans cette même première boucle, initialisez sinistres_par_region.setdefault(reg, 0.0) pour ne pas perdre les 5 régions sans sinistre.",
        "Parcourez ensuite df_sinistres.to_dict('records') : retrouvez reg = police_region[sin['police_id']] et ajoutez sin['cout_total'] à sinistres_par_region[reg].",
      ],
      guide: {
        theoryToPracticeLink: `Pour éviter le piège du fan-out ($P_g$ multiplié par le nombre de sinistres) et garder les régions à $S_g = 0$, l'algorithme Hash-Join/Aggregate sépare le parcours des polices (cumul des primes + index \`police_id -> region\`) du parcours des sinistres (cumul des coûts via l'index).`,
        stepByStepPlan: [
          "Initialiser trois dictionnaires vides : `primes_par_region`, `sinistres_par_region`, `police_region`.",
          "Boucle 1 sur `df_assures.to_dict('records')` : accumuler les primes par région avec `.get(reg, 0.0)`, remplir `police_region[pid] = reg` et initialiser `sinistres_par_region[reg] = 0.0`.",
          "Boucle 2 sur `df_sinistres.to_dict('records')` : retrouver `reg = police_region.get(sin['police_id'])` et additionner `sin['cout_total']`.",
          "Construire `sp_par_region` par compréhension de dictionnaire.",
        ],
        concepts: [
          {
            symbol: ".to_dict('records')",
            kind: "Fonction / Méthode",
            roleInExercise: "Transforme un `DataFrame` Pandas en liste de dictionnaires Python natifs.",
          },
          {
            symbol: "d.get(cle, 0.0)",
            kind: "Fonction / Méthode",
            roleInExercise: "Lit la valeur existante ou retourne `0.0` si la clé apparaît pour la première fois.",
          },
          {
            symbol: "police_region",
            kind: "Variable",
            roleInExercise: "Table de hachage `police_id -> region` effectuant la jointure en temps $O(1)$.",
          },
          {
            symbol: "primes_par_region",
            kind: "Variable",
            roleInExercise: "Dictionnaire reproduisant `SUM(prime_annuelle) GROUP BY region` sans fan-out.",
          },
          {
            symbol: "sinistres_par_region / sp_par_region",
            kind: "Variable",
            roleInExercise: "Dictionnaires des sinistres totaux et du ratio S/P pour les 9 régions.",
          },
        ],
        guidedCode: `primes_par_region = {}
sinistres_par_region = {}
police_region = {}

# 1. Parcours des polices (1 ligne = 1 contrat, zéro fan-out)
for row in df_assures.to_dict('records'):
    reg = row['region']
    primes_par_region[reg] = primes_par_region.get(reg, 0.0) + float(row['___'])
    police_region[row['police_id']] = ___
    sinistres_par_region.setdefault(reg, 0.0)

# 2. Parcours des sinistres avec jointure via police_region
for sin in df_sinistres.to_dict('records'):
    reg = police_region.get(sin['___'])
    if reg is not None:
        sinistres_par_region[reg] += float(sin['___'])

# 3. Calcul du ratio S/P par région
sp_par_region = {r: sinistres_par_region[r] / primes_par_region[r] for r in primes_par_region}
print(sp_par_region)`,
      },
    },
    {
      id: "py-prog-22",
      title: "22. Grille de Pricing Black-Scholes-Merton 2D (Double Boucle & Clés Tuples)",
      category: "monte_carlo",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 22,
      description: "Implémentez le pricer analytique call_bsm(S, K, T, r, sigma) avec scipy.stats.norm.cdf, puis évaluez une grille 2D (spot x volatilité) par double boucle stockée dans un dictionnaire à clés tuples grille_prix[(S, vol)].",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Formule de Black-Scholes-Merton & Sensibilités (Delta, Vega)

#### Intuition Économique & Enjeux de Structuration d'Options
Un **Call Européen** donne le droit (non l'obligation) d'acheter un sous-jacent à la maturité $T$ au prix d'exercice convenu $K$, pour un *payoff* terminal $\\max(S_T - K, 0)$. Par argument de réplication dynamique sans arbitrage sous probabilité risque-neutre $\\mathbb{Q}$, Black, Scholes et Merton (1973) ont établi son prix exact en fonction de cinq paramètres : le cours spot $S$, le strike $K$, la maturité $T$, le taux sans risque $r$ et la volatilité implicite $\\sigma$.

En salle des marchés ou en ALM d'épargne à garantie plancher, on ne calcule jamais un prix isolé : on produit une **matrice de sensibilité 2D** croisant plusieurs niveaux de spot $S$ (mesure du **Delta** $\\Delta = \\frac{\\partial C}{\\partial S} > 0$) et plusieurs régimes de volatilité $\\sigma$ (mesure du **Vega** $\\mathcal{V} = \\frac{\\partial C}{\\partial \\sigma} > 0$).

#### Démonstration Mathématique Formelle
Sous mesure risque-neutre $\\mathbb{Q}$, $dS_t = r S_t dt + \\sigma S_t dW_t^{\\mathbb{Q}}$. L'espérance actualisée $C(S, K, T, r, \\sigma) = e^{-rT}\\mathbb{E}^{\\mathbb{Q}}[\\max(S_T - K, 0)]$ s'intègre analytiquement à l'aide de la fonction de répartition gaussienne $\\Phi(\\cdot)$ :

$$C = S\\, \\Phi(d_1) - K e^{-rT}\\, \\Phi(d_2)$$

avec les deux quantiles normalisés :

$$d_1 = \\frac{\\ln(S / K) + \\left(r + \\frac{1}{2}\\sigma^2\\right)T}{\\sigma \\sqrt{T}}, \\qquad d_2 = d_1 - \\sigma \\sqrt{T}$$

Statiques comparatives fondamentales :
- $\\Delta = \\frac{\\partial C}{\\partial S} = \\Phi(d_1) \\in ]0, 1[$ : le prix du Call est **strictement croissant** avec le spot $S$.
- $\\mathcal{V} = \\frac{\\partial C}{\\partial \\sigma} = S \\sqrt{T}\\, \\phi(d_1) > 0$ : le prix du Call est **strictement croissant** avec la volatilité $\\sigma$ (car la convexité du payoff profite des grandes variations à la hausse tout en plafonnant les pertes à zéro).

### 💻 Masterclass Programmation Python : \`scipy.stats.norm.cdf\` & Clés Tuples \`(S, vol)\` dans un \`dict\`

1. **Pourquoi un \`tuple\` \`(S, vol)\` comme clé de dictionnaire et jamais une \`list\` \`[S, vol]\` ?**
   Les clés d'un \`dict\` doivent être **immuables et hachables** (*hashable*). Un \`tuple\` \`(90.0, 0.15)\` est immuable et accepté comme clé de dictionnaire 2D (\`grille_prix[(90.0, 0.15)]\`), alors qu'une \`list\` \`[90.0, 0.15]\` déclencherait immédiatement \`TypeError: unhashable type: 'list'\`.
2. **Balayage cartésien par double boucle** :
   \`for S in spots: for vol in vols: grille_prix[(S, vol)] = call_bsm(S, 100.0, 1.0, 0.03, vol)\` génère les $3 \\times 2 = 6$ paires de paramètres.

\`\`\`python
import math
from scipy.stats import norm

def bsm_call_demo(S, K, T, r, sigma):
    d1 = (math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return S * norm.cdf(d1) - K * math.exp(-r * T) * norm.cdf(d2)

# Exemple exécuté : impact de la volatilité réalisée historique sur un Call ATM K=100, T=1, r=3%
for vol_test in [0.10, 0.20, 0.30]:
    prix_atm = bsm_call_demo(100.0, 100.0, 1.0, 0.03, vol_test)
    print(f"Call ATM (S=100, K=100, vol={vol_test:.0%}) -> Prix = {prix_atm:6.3f} EUR")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Call ATM (S=100, K=100, vol=10%) -> Prix =  5.582 EUR
Call ATM (S=100, K=100, vol=20%) -> Prix =  9.413 EUR
Call ATM (S=100, K=100, vol=30%) -> Prix = 13.283 EUR
\`\`\`

À $S = K = 100$, doubler la volatilité de $10\\%$ à $20\\%$ augmente le prix de $+3.831\\text{ EUR}$ (presque linéaire en Vega autour du point ATM, $\\mathcal{V} \\approx 0.4 S \\sqrt{T} \\approx 40$ par unité de vol, soit $\\approx 4\\text{ EUR}$ pour $+10\\%$ de volatilité).`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Implémentez la formule exacte de Black-Scholes-Merton pour un Call européen ($K = 100.0$, $T = 1.0$, $r = 0.03$) et évaluez la matrice de sensibilité 2D sur \`spots = [90.0, 100.0, 110.0]\` et \`vols = [0.15, 0.25]\`.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. Importez \`math\` et \`from scipy.stats import norm\`.
2. Écrivez \`def call_bsm(S, K, T, r, sigma):\` retournant le prix flottant exact (note : \`float(...)\`).
3. Définissez \`spots = [90.0, 100.0, 110.0]\` et \`vols = [0.15, 0.25]\`.
4. Par double boucle imbriquée, remplissez \`grille_prix = {}\` avec des clés tuples \`(S, vol)\` : \`grille_prix[(S, vol)] = call_bsm(S, 100.0, 1.0, 0.03, vol)\`.
5. Affichez la grille 2D.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `import math
from scipy.stats import norm

def call_bsm(S, K, T, r, sigma):
    """Prix analytique d'un Call Européen selon Black-Scholes-Merton."""
    d1 = (math.log(S / K) + (r + 0.5 * (sigma ** 2)) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return float(S * norm.cdf(d1) - K * math.exp(-r * T) * norm.cdf(d2))

spots = [90.0, 100.0, 110.0]
vols = [0.15, 0.25]
grille_prix = {}

for S in spots:
    for vol in vols:
        grille_prix[(S, vol)] = call_bsm(S, 100.0, 1.0, 0.03, vol)

for (S, vol), prix in grille_prix.items():
    print(f"Spot={S:5.1f} | Vol={vol:.0%} -> Call BSM = {prix:6.3f} EUR")`,
      testPythonCode: `import math
assert 'call_bsm' in globals() and callable(call_bsm), "La fonction call_bsm doit être définie."
assert 'grille_prix' in globals() and isinstance(grille_prix, dict) and len(grille_prix) == 6, "grille_prix doit contenir 6 couples (S, vol)."
for _s in [90.0, 100.0, 110.0]:
    for _v in [0.15, 0.25]:
        assert (_s, _v) in grille_prix, f"Clé tuple {(_s, _v)} manquante dans grille_prix."
assert abs(grille_prix[(100.0, 0.25)] - 11.348477) < 1e-3, "Prix BSM incorrect pour (100.0, 0.25) : attendu ~11.3485."
assert abs(grille_prix[(90.0, 0.15)] - 2.758444) < 1e-3, "Prix BSM incorrect pour (90.0, 0.15) : attendu ~2.7584."
assert grille_prix[(110.0, 0.25)] > grille_prix[(100.0, 0.25)] > grille_prix[(90.0, 0.25)], "Monotonie Delta (>0) non vérifiée."
assert grille_prix[(100.0, 0.25)] > grille_prix[(100.0, 0.15)], "Monotonie Vega (>0) non vérifiée." `,
      datasets: [],
      hints: [
        "Importez math et from scipy.stats import norm. Dans call_bsm, calculez d1 puis d2 = d1 - sigma * math.sqrt(T).",
        "Utilisez norm.cdf(d1) et norm.cdf(d2) dans S * norm.cdf(d1) - K * math.exp(-r * T) * norm.cdf(d2).",
        "Dans la double boucle for S in spots: for vol in vols:, utilisez un tuple comme clé : grille_prix[(S, vol)] = call_bsm(S, 100.0, 1.0, 0.03, vol).",
      ],
      guide: {
        theoryToPracticeLink: `La formule fermée $C = S\\Phi(d_1) - Ke^{-rT}\\Phi(d_2)$ est encapsulée dans \`call_bsm\`, puis balayée sur le produit cartésien \`spots x vols\` via deux boucles \`for\` stockant les résultats dans un dictionnaire indexé par tuples \`(S, vol)\`.`,
        stepByStepPlan: [
          "Importer `math` et `from scipy.stats import norm`.",
          "Définir `def call_bsm(S, K, T, r, sigma):` calculant `d1`, `d2` et le prix du Call.",
          "Initialiser `spots = [90.0, 100.0, 110.0]`, `vols = [0.15, 0.25]` et `grille_prix = {}`.",
          "Remplir `grille_prix[(S, vol)] = call_bsm(S, 100.0, 1.0, 0.03, vol)` via une double boucle imbriquée.",
        ],
        concepts: [
          {
            symbol: "norm.cdf(...)",
            kind: "Fonction / Méthode",
            roleInExercise: "Fonction de répartition $\\Phi(\\cdot)$ de la loi normale standard via SciPy.",
          },
          {
            symbol: "call_bsm",
            kind: "Fonction / Méthode",
            roleInExercise: "Pricer analytique Black-Scholes-Merton d'un Call Européen.",
          },
          {
            symbol: "grille_prix[(S, vol)]",
            kind: "Syntaxe",
            roleInExercise: "Dictionnaire indexé par un tuple immuable `(S, vol)` représentant une grille 2D.",
          },
          {
            symbol: "Double boucle for",
            kind: "Syntaxe",
            roleInExercise: "Génère les $3 \\times 2 = 6$ combinaisons Spot $\\times$ Volatilité.",
          },
          {
            symbol: "spots / vols",
            kind: "Variable",
            roleInExercise: "Listes de paramètres de marché (`[90.0, 100.0, 110.0]` et `[0.15, 0.25]`) balayées sur $K=100, T=1, r=0.03$.",
          },
        ],
        guidedCode: `import math
from scipy.stats import norm

def call_bsm(S, K, T, r, sigma):
    d1 = (math.log(S / K) + (r + 0.5 * (sigma ** 2)) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(___)
    return float(S * norm.cdf(d1) - K * math.exp(-r * T) * norm.cdf(___))

spots = [90.0, 100.0, 110.0]
vols = [0.15, 0.25]
grille_prix = {}

for S in spots:
    for vol in vols:
        grille_prix[(S, vol)] = call_bsm(S, 100.0, 1.0, 0.03, ___)

print(grille_prix)`,
      },
    },
    {
      id: "py-prog-23",
      title: "23. Boucle Python vs Vectorisation NumPy (Somme des Carrés sur CAC 40)",
      category: "data_engineering",
      language: "python",
      difficulty: "Intermédiaire",
      durationMinutes: 18,
      description: "Implémentez somme_carres_boucle(valeurs) en pur Python sur df['cac40_rendement'].tolist(), comparez le résultat à np.sum(np.array(valeurs)**2) et vérifiez la précision machine (ecart_max < 1e-9).",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Variance Réalisée, Somme des Carrés & Architecture Vectorielle

#### Intuition Économique & Enjeux d'Économétrie Financière
La **somme des carrés des rendements** $\\sum_{t=1}^T r_t^2$ est l'estimateur brut de la **variance réalisée** (*Realized Variance*, Andersen & Bollerslev) en finance haute fréquence, ainsi que l'ingrédient central des modèles de volatilité conditionnelle **ARCH / GARCH** et des tests de spécification MCO.

#### Démonstration Mathématique Formelle
Soit la chronique des $T = 16$ rendements trimestriels du CAC 40 dans \`df['cac40_rendement']\`. L'énergie quadratique totale vaut :

$$SC = \\sum_{t=1}^T r_t^2 = \\mathbf{r}^\\top \\mathbf{r}$$

Bien que la formule algébrique soit identique en pur Python et en algèbre NumPy, l'ordre d'addition des flottants IEEE-754 (addition séquentielle de gauche à droite vs réduction par paires SIMD en C) peut introduire une infime différence numérique de l'ordre de $\\varepsilon_{\\text{mach}} \\cdot SC \\approx 10^{-13}$ (car l'addition flottante n'est pas rigoureusement associative !). On valide donc la concordance par $|SC_{\\text{boucle}} - SC_{\\text{NumPy}}| < 10^{-9}$.

### 💻 Masterclass Programmation Python : Bytecode Python vs Mémoire Contiguë C (NumPy)

Pourquoi l'ingénierie financière privilégie-t-elle NumPy sur de grands volumes tout en sachant écrire la boucle de référence ?
1. **Boucle \`for\` en Python pur** : à chaque tour de boucle, l'interpréteur CPython résout dynamiquement le type de l'objet \`float\` (un objet Python boxé de 24 octets), cherche l'opérateur \`**\`, alloue un nouvel objet résultat et l'ajoute à l'accumulateur. C'est pédagogique et universel, mais lent sur $10^7$ éléments.
2. **Vectorisation NumPy (\`np.array(valeurs) ** 2\`)** : stocke tous les flottants dans un bloc RAM contigu en C (\`float64\`, 8 octets chacun, sans boxing) et exécute la mise au carré et la somme en instructions CPU SIMD compilées en C — typiquement $30\\times$ à $100\\times$ plus rapide !
3. **Passerelle Pandas $\\to$ Python natif** : \`df['colonne'].tolist()\` convertit une \`pd.Series\` en une liste Python standard de \`float\`.

\`\`\`python
import numpy as np

# Exemple exécuté : somme des carrés sur l'inflation HICP de \`df\` (16 trimestres)
infl = df['inflation_hicp'].tolist()

sc_py = 0.0
for x in infl:
    sc_py += x ** 2

arr_infl = np.array(infl)
sc_np = float(np.sum(arr_infl ** 2))
ecart = abs(sc_py - sc_np)

print("Nombre d'observations :", len(infl))
print(f"Somme carrés boucle Python : {sc_py:.15f}")
print(f"Somme carrés NumPy         : {sc_np:.15f}")
print(f"Écart absolu               : {ecart:.3e} (< 1e-9 : {ecart < 1e-9})")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Nombre d'observations : 16
Somme carrés boucle Python : 458.700000000000045
Somme carrés NumPy         : 458.700000000000045
Écart absolu               : 0.000e+00 (< 1e-9 : True)
\`\`\`

Les deux implémentations donnent exactement le même résultat mathématique à la précision machine près, validant la boucle de référence avant son passage à l'échelle vectorisé.`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Calculez la somme des carrés des rendements trimestriels du CAC 40 issus du DataFrame préchargé \`df['cac40_rendement']\` ($T = 16$ trimestres) selon deux approches indépendantes — boucle impérative vs vectorisation NumPy — et contrôlez l'écart numérique $|SC_{\\text{boucle}} - SC_{\\text{NumPy}}| < 10^{-9}$.

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. Importez \`numpy as np\`.
2. Écrivez \`def somme_carres_boucle(valeurs):\` utilisant une boucle \`for\` Python pure (sans NumPy à l'intérieur) pour sommer \`v ** 2\`.
3. Extrayez \`rendements_cac = df['cac40_rendement'].tolist()\`.
4. Calculez \`sc_boucle = somme_carres_boucle(rendements_cac)\` et \`sc_numpy = float(np.sum(np.array(rendements_cac) ** 2))\`.
5. Calculez \`ecart_max = abs(sc_boucle - sc_numpy)\` et vérifiez qu'il est \`< 1e-9\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `import numpy as np

def somme_carres_boucle(valeurs):
    """Calcule la somme des carrés par boucle for pure Python."""
    total = 0.0
    for v in valeurs:
        total += v ** 2
    return total

rendements_cac = df['cac40_rendement'].tolist()
sc_boucle = somme_carres_boucle(rendements_cac)
sc_numpy = float(np.sum(np.array(rendements_cac) ** 2))
ecart_max = abs(sc_boucle - sc_numpy)

print(f"Boucle Python : {sc_boucle:.6f} | NumPy : {sc_numpy:.6f} | Écart : {ecart_max:.2e}")`,
      testPythonCode: `import numpy as np
assert 'somme_carres_boucle' in globals() and callable(somme_carres_boucle), "La fonction somme_carres_boucle doit être définie."
assert abs(somme_carres_boucle([3.0, -4.0]) - 25.0) < 1e-9, "somme_carres_boucle([3.0, -4.0]) doit valoir 25.0."
assert 'rendements_cac' in globals() and isinstance(rendements_cac, list) and len(rendements_cac) == 16, "rendements_cac doit être une liste de 16 éléments extraite via .tolist()."
assert 'sc_boucle' in globals() and abs(sc_boucle - 1886.15) < 1e-6, "sc_boucle attendue : 1886.15."
assert 'sc_numpy' in globals() and abs(sc_numpy - 1886.15) < 1e-6, "sc_numpy attendue : 1886.15."
assert 'ecart_max' in globals() and ecart_max < 1e-9, "ecart_max doit être strictement inférieur à 1e-9." `,
      datasets: [],
      hints: [
        "Convertissez la colonne Pandas en liste Python avec rendements_cac = df['cac40_rendement'].tolist().",
        "Dans somme_carres_boucle(valeurs), initialisez total = 0.0 et additionnez v ** 2 dans une boucle for v in valeurs:.",
        "Comparez avec sc_numpy = float(np.sum(np.array(rendements_cac) ** 2)) et ecart_max = abs(sc_boucle - sc_numpy).",
      ],
      guide: {
        theoryToPracticeLink: `La même formule $\\sum r_t^2$ s'implémente soit par itération Python pure \`for v in valeurs: total += v**2\`, soit par opération vectorielle C/SIMD \`np.sum(np.array(valeurs)**2)\`, et leur écart IEEE-754 reste inférieur à \`1e-9\`.`,
        stepByStepPlan: [
          "Importer `numpy as np`.",
          "Écrire `def somme_carres_boucle(valeurs):` avec un accumulateur `total = 0.0` et une boucle `for`.",
          "Extraire `rendements_cac = df['cac40_rendement'].tolist()`.",
          "Calculer `sc_boucle`, `sc_numpy` et `ecart_max = abs(sc_boucle - sc_numpy)`.",
        ],
        concepts: [
          {
            symbol: ".tolist()",
            kind: "Fonction / Méthode",
            roleInExercise: "Extrait les valeurs d'une `pd.Series` vers une liste Python native.",
          },
          {
            symbol: "somme_carres_boucle",
            kind: "Fonction / Méthode",
            roleInExercise: "Implémentation de référence en pur Python sommant les carrés.",
          },
          {
            symbol: "np.sum(np.array(...) ** 2)",
            kind: "Fonction / Méthode",
            roleInExercise: "Équivalent vectorisé NumPy s'exécutant sur tableau contigu C.",
          },
          {
            symbol: "ecart_max",
            kind: "Variable",
            roleInExercise: "Différence absolue entre les deux méthodes (`< 1e-9`).",
          },
          {
            symbol: "df['cac40_rendement']",
            kind: "Colonne / Table",
            roleInExercise: "Colonne du DataFrame macroéconomique `df` contenant les 16 rendements trimestriels du CAC 40.",
          },
        ],
        guidedCode: `import numpy as np

def somme_carres_boucle(valeurs):
    total = 0.0
    for v in valeurs:
        total += v ** ___
    return ___

rendements_cac = df['cac40_rendement'].tolist()
sc_boucle = somme_carres_boucle(rendements_cac)
sc_numpy = float(np.sum(np.array(rendements_cac) ** ___))
ecart_max = abs(sc_boucle - sc_numpy)

print(sc_boucle, sc_numpy, ecart_max < 1e-9)`,
      },
    },
    {
      id: "py-prog-24",
      title: "24. Mini-Projet de Synthèse ALM : Stress-Test de Bilan Multi-Taux",
      category: "alm",
      language: "python",
      difficulty: "Avancé",
      durationMinutes: 25,
      description: "Synthétisez fonctions, boucles, dictionnaires et compréhensions dans un moteur ALM complet : valeur_actuelle_flux(flux, taux) et stress_test_bilan(actifs, passifs, grille_taux) identifiant les taux critiques où le gap de solvabilité devient négatif.",
      theoryMarkdown: `### 🎓 Cours Théorique Approfondi : Désadossement de Duration (*Duration Mismatch*) & Stress-Test de Bilan Solvabilité II

#### Intuition Économique & Enjeux ALM Assurance Vie
Dans le bilan économique d'un assureur vie ou d'un fonds de pension, les **passifs** (engagements garantis envers les assurés à 8, 15 ou 30 ans) ont souvent une **duration plus longue** que les **actifs** obligataires disponibles à l'actif ($D_{\\text{passif}} > D_{\\text{actif}}$).

Que se passe-t-il si les taux d'intérêt baissent ? Par sensibilité au taux ($\\frac{\\Delta V}{V} \\approx -D_{\\text{mod}}\\,\\Delta r$), la valeur actuelle des passifs longs gonfle **plus vite** que celle des actifs plus courts ! À l'inverse, lorsque les taux montent, le passif s'actualise fortement à la baisse et le surplus économique (**Gap ALM / Fonds Propres économiques**) s'améliore. Identifier les régimes de taux où le bilan devient insolvable ($\\text{Gap}(r) < 0$) est au cœur des tests de résistance réglementaires (**Solvabilité II — choc de taux à la baisse**).

#### Démonstration Mathématique Formelle
Soient deux chroniques annuelles de flux $\\mathbf{A} = (A_1, \\dots, A_{T_A})$ à l'actif et $\\mathbf{L} = (L_1, \\dots, L_{T_L})$ au passif. Pour tout scénario de taux plat $r > -1$, la valeur actuelle de bilan et le **Gap économique de solvabilité** s'écrivent :

$$VA_A(r) = \\sum_{t=1}^{T_A} \\frac{A_t}{(1 + r)^t}, \\qquad VA_L(r) = \\sum_{t=1}^{T_L} \\frac{L_t}{(1 + r)^t}, \\qquad \\text{Gap}(r) = VA_A(r) - VA_L(r)$$

La condition de solvabilité économique impose $\\text{Gap}(r) \\ge 0$. En dérivant par rapport à $r$ au voisinage d'un point d'équilibre $VA_A(r_0) = VA_L(r_0) = V_0$ :

$$\\frac{\\partial \\text{Gap}}{\\partial r}\\Big|_{r_0} = -V_0 \\big(D_{\\text{mod}, A} - D_{\\text{mod}, L}\\big)$$

Si $D_{\\text{mod}, L} > D_{\\text{mod}, A}$ (passif plus long que l'actif), alors $\\frac{\\partial \\text{Gap}}{\\partial r} > 0$ : **une baisse des taux dégrade le bilan** et crée une zone critique aux taux bas !

### 💻 Masterclass Programmation Python : Architecture Modulaire Complète

Ce mini-projet réunit l'ensemble des briques apprises dans le module :
1. **Fonction élémentaire \`valeur_actuelle_flux(flux, taux)\`** : boucle \`for t, cf in enumerate(flux, start=1):\` factorisant le calcul d'actualisation pour n'importe quel échéancier (actif comme passif).
2. **Fonction orchestratrice \`stress_test_bilan(actifs, passifs, grille_taux)\`** : boucle sur chaque scénario \`r in grille_taux\`, réutilise deux fois \`valeur_actuelle_flux(...)\`, calcule \`gap = va_actif - va_passif\` et peuple un dictionnaire \`{r: gap}\`.
3. **Extraction déclarative par compréhension de liste** :
   \`taux_critiques = [r for r, gap in resultats_stress.items() if gap < 0]\`
   parcourt les paires \`(cle, valeur)\` via \`.items()\` pour isoler instantanément les taux provoquant un déficit économique.

\`\`\`python
# Exemple exécuté : stress-test sur la fourchette des taux 10y observés dans \`df_taux\` (2.55% à 3.42%)
def va_ex(flux, r):
    return sum(cf / ((1.0 + r) ** t) for t, cf in enumerate(flux, start=1))

actifs_ex = [3000.0, 3000.0, 3000.0, 3000.0]     # Duration courte (~2.4 ans)
passifs_ex = [0.0, 0.0, 0.0, 0.0, 0.0, 13200.0]   # Passif in fine 6 ans
grille_taux_reelle = sorted({round(float(x) / 100.0, 4) for x in [df_taux['taux_10y'].min(), df_taux['taux_10y'].median(), df_taux['taux_10y'].max()]})

for r in grille_taux_reelle:
    va_a, va_p = va_ex(actifs_ex, r), va_ex(passifs_ex, r)
    print(f"Scénario taux {r:.2%} | VA Actif={va_a:9.2f} | VA Passif={va_p:9.2f} | Gap={va_a - va_p:+8.2f} EUR")
\`\`\`

### 🖥️ Exemple Exécuté (Terminal REPL \`python3\`)

\`\`\`text
Scénario taux 2.55% | VA Actif= 11272.34 | VA Passif= 11349.06 | Gap=  -76.72 EUR
Scénario taux 3.05% | VA Actif= 11137.97 | VA Passif= 11022.65 | Gap= +115.33 EUR
Scénario taux 3.42% | VA Actif= 11040.20 | VA Passif= 10788.14 | Gap= +252.05 EUR
\`\`\`

Au taux minimal de \`2.55%\` (décembre 2023), le passif long à 6 ans gonfle jusqu'à dépasser l'actif court (\`Gap = -76.72 EUR\`), avant de redevenir positif dès \`3.05%\` (\`+115.33 EUR\`).`,
      taskMarkdown: `**Volet 1 — Exigences Mathématiques & Métier :**
Analysez un bilan présentant un désadossement actif-passif classique ($D_{\\text{passif}} = 8$ ans $> D_{\\text{actif}}$) :
- Actifs (5 annuités) : \`[2500.0, 2500.0, 2500.0, 2500.0, 2500.0]\`
- Passif (zéro-coupon 8 ans) : \`[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 14100.0]\`
Exécutez le stress-test sur la grille \`[0.01, 0.02, 0.03, 0.04]\` pour identifier les taux bas critiques rendant le bilan déficitaire ($\\text{Gap} < 0$).

**Volet 2 — Laboratoire Pratique Python :**
Définissez exactement :
1. \`def valeur_actuelle_flux(flux, taux):\` retournant $\\sum_{t=1}^T \\frac{CF_t}{(1+\\text{taux})^t}$.
2. \`def stress_test_bilan(actifs, passifs, grille_taux):\` retournant un dictionnaire \`{taux: va_actif - va_passif}\` pour chaque taux de \`grille_taux\`.
3. Définissez \`actifs = [2500.0, 2500.0, 2500.0, 2500.0, 2500.0]\`, \`passifs = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 14100.0]\` et \`grille_taux = [0.01, 0.02, 0.03, 0.04]\`.
4. Calculez \`resultats_stress = stress_test_bilan(actifs, passifs, grille_taux)\` et extrayez par compréhension \`taux_critiques = [r for r, gap in resultats_stress.items() if gap < 0]\`.`,
      initialCode: "# Écrivez votre programme Python ci-dessous :\n",
      solutionCode: `def valeur_actuelle_flux(flux, taux):
    """Actualise une liste de flux annuels (t = 1..T) au taux donné."""
    va = 0.0
    for t, cf in enumerate(flux, start=1):
        va += cf / ((1.0 + taux) ** t)
    return va

def stress_test_bilan(actifs, passifs, grille_taux):
    """Évalue le gap économique (VA Actifs - VA Passifs) sur une grille de taux."""
    resultats = {}
    for taux in grille_taux:
        va_actif = valeur_actuelle_flux(actifs, taux)
        va_passif = valeur_actuelle_flux(passifs, taux)
        resultats[taux] = va_actif - va_passif
    return resultats

actifs = [2500.0, 2500.0, 2500.0, 2500.0, 2500.0]
passifs = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 14100.0]
grille_taux = [0.01, 0.02, 0.03, 0.04]

resultats_stress = stress_test_bilan(actifs, passifs, grille_taux)
taux_critiques = [r for r, gap in resultats_stress.items() if gap < 0]

for r, gap in resultats_stress.items():
    print(f"Taux {r:.1%} -> Gap ALM = {gap:+9.2f} EUR")
print("Taux critiques (Gap < 0) :", taux_critiques)`,
      testPythonCode: `assert 'valeur_actuelle_flux' in globals() and callable(valeur_actuelle_flux), "valeur_actuelle_flux doit être définie."
assert 'stress_test_bilan' in globals() and callable(stress_test_bilan), "stress_test_bilan doit être définie."
assert 'resultats_stress' in globals() and isinstance(resultats_stress, dict) and len(resultats_stress) == 4, "resultats_stress doit contenir les 4 scénarios de taux."
assert abs(resultats_stress[0.01] - (-887.5356)) < 0.05, "Gap à 1% incorrect (~ -887.54 EUR)."
assert abs(resultats_stress[0.02] - (-250.5677)) < 0.05, "Gap à 2% incorrect (~ -250.57 EUR)."
assert abs(resultats_stress[0.03] - 318.6004) < 0.05, "Gap à 3% incorrect (~ +318.60 EUR)."
assert abs(resultats_stress[0.04] - 826.8240) < 0.05, "Gap à 4% incorrect (~ +826.82 EUR)."
assert 'taux_critiques' in globals() and taux_critiques == [0.01, 0.02], "taux_critiques doit valoir [0.01, 0.02]."
assert stress_test_bilan([1050.0], [1050.0], [0.05]) == {0.05: 0.0}, "stress_test_bilan doit être générique." `,
      datasets: [],
      hints: [
        "Codez d'abord def valeur_actuelle_flux(flux, taux): avec for t, cf in enumerate(flux, start=1):.",
        "Dans stress_test_bilan(actifs, passifs, grille_taux), bouclez sur grille_taux et stockez resultats[taux] = valeur_actuelle_flux(actifs, taux) - valeur_actuelle_flux(passifs, taux).",
        "Extrayez ensuite les taux déficitaires avec : taux_critiques = [r for r, gap in resultats_stress.items() if gap < 0].",
      ],
      guide: {
        theoryToPracticeLink: `La décomposition $\\text{Gap}(r) = VA_A(r) - VA_L(r)$ est factorisée grâce à la réutilisation de \`valeur_actuelle_flux\` à l'intérieur de \`stress_test_bilan\`, puis filtrée par compréhension de liste sur \`.items()\` pour détecter le risque de taux bas (\`gap < 0\`).`,
        stepByStepPlan: [
          "Définir `def valeur_actuelle_flux(flux, taux):` avec `enumerate(flux, start=1)`.",
          "Définir `def stress_test_bilan(actifs, passifs, grille_taux):` qui appelle deux fois `valeur_actuelle_flux` pour chaque taux et remplit `resultats[taux]`.",
          "Créer `actifs`, `passifs` et `grille_taux = [0.01, 0.02, 0.03, 0.04]`.",
          "Calculer `resultats_stress` puis filtrer `taux_critiques = [r for r, gap in resultats_stress.items() if gap < 0]`.",
        ],
        concepts: [
          {
            symbol: "valeur_actuelle_flux",
            kind: "Fonction / Méthode",
            roleInExercise: "Brique de base réutilisée à la fois pour l'actif et pour le passif.",
          },
          {
            symbol: "stress_test_bilan",
            kind: "Fonction / Méthode",
            roleInExercise: "Orchestre la boucle sur les scénarios de taux et retourne `{taux: gap}`.",
          },
          {
            symbol: ".items()",
            kind: "Fonction / Méthode",
            roleInExercise: "Méthode de dictionnaire itérant simultanément sur chaque couple `(clé, valeur)`.",
          },
          {
            symbol: "resultats_stress",
            kind: "Variable",
            roleInExercise: "Dictionnaire des $4$ gaps de solvabilité ALM (négatif à $1\\%$ et $2\\%$, positif à $3\\%$ et $4\\%$).",
          },
          {
            symbol: "taux_critiques",
            kind: "Variable",
            roleInExercise: "Liste des taux déclenchant une sous-couverture économique (`[0.01, 0.02]`).",
          },
        ],
        guidedCode: `def valeur_actuelle_flux(flux, taux):
    va = 0.0
    for t, cf in enumerate(flux, start=1):
        va += cf / ((1.0 + ___) ** ___)
    return va

def stress_test_bilan(actifs, passifs, grille_taux):
    resultats = {}
    for taux in grille_taux:
        va_actif = valeur_actuelle_flux(___, taux)
        va_passif = valeur_actuelle_flux(___, taux)
        resultats[taux] = va_actif - va_passif
    return resultats

actifs = [2500.0, 2500.0, 2500.0, 2500.0, 2500.0]
passifs = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 14100.0]
grille_taux = [0.01, 0.02, 0.03, 0.04]

resultats_stress = stress_test_bilan(actifs, passifs, grille_taux)
taux_critiques = [r for r, gap in resultats_stress.items() if gap < ___]
print(resultats_stress, taux_critiques)`,
      },
    },
  ],
};
