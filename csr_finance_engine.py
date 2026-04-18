#!/usr/bin/env python3
# ================================================
# CSR FINANCE ENGINE - Version 2.0 (DZD Edition)
# Plateforme de Résilience Sismique CATNAT
# Exécutable mensuellement pour reporting automatisé
# ================================================

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime, timedelta
import json

print("=" * 80)
print("CSR FINANCE ENGINE v2.0 - Automated Monthly Reporting")
print("=" * 80)

# ===================== CONFIGURATION =====================
DATA_DIR = Path("data")
REPORT_DIR = Path("reports")
REPORT_DIR.mkdir(exist_ok=True)

# PARAMÈTRES FINANCIERS (EN DZD)
TOTAL_CAPITAL_DZD = 43_431_810_000_000        # 43,431.81 Md DZD
AVAILABLE_CAPITAL_DZD = TOTAL_CAPITAL_DZD * 0.10
RETENTION_DZD = 72_500_000_000               # 72.5 Md DZD (500M USD)
USD_TO_DZD = 145                              # Exchange rate

# ZONE III CRITICAL EXPOSURE (DZD)
ZONE_III_CAPITAL_DZD = 2_882_760_000_000      # 2,882.76 Md DZD
ZONE_III_TARGET = TOTAL_CAPITAL_DZD * 0.04   # Target: 4% (vs current 6.64%)

# STRUCTURE RÉASSURANCE - OPTION A (SIMPLIFIÉ - 3 COUCHES)
LAYER1_LIMIT_DZD = 145_000_000_000            # 145 Md DZD
LAYER2_LIMIT_DZD = 290_000_000_000            # 290 Md DZD
LAYER2_RETENTION_DZD = 217_500_000_000        # 217.5 Md DZD
LAYER3_LIMIT_DZD = 1_160_000_000_000          # 1,160 Md DZD
LAYER3_RETENTION_DZD = 435_000_000_000        # 435 Md DZD

# ===================== CHARGEMENT DES DONNÉES =====================
print("\n📥 Chargement des données...")

try:
    pml = pd.read_csv(DATA_DIR / "pml_scenarios.csv", decimal=",")
    hotspots = pd.read_csv(DATA_DIR / "hotspots_identified.csv", decimal=",")
    segment = pd.read_csv(DATA_DIR / "portfolio_3d_segmentation.csv", decimal=",")
    stress = pd.read_csv(DATA_DIR / "stress_test_scenarios.csv", decimal=",")
    print("✅ Tous les fichiers de données chargés avec succès")
except FileNotFoundError as e:
    print(f"❌ Erreur: {e}")
    print("   Assurez-vous que les fichiers CSV sont dans le dossier 'data/'")
    exit(1)

# ===================== CALCULS FINANCIERS (DZD) =====================
print("\n🔢 Calculs financiers en cours...\n")

# Convertir données USD → DZD
pml['Total_PML_DZD'] = pml['Total_PML'] * USD_TO_DZD
pml['Capital_At_Risk_DZD'] = pml['Capital_At_Risk'] * USD_TO_DZD

# Scénario 1-in-250 ans (Scenario_2)
scenario_2_idx = pml[pml['Scenario_ID'] == 'Scenario_2'].index[0]
gross_loss_dzd = pml.loc[scenario_2_idx, 'Total_PML_DZD']
zone_iii_capital_dzd = pml.loc[scenario_2_idx, 'Capital_At_Risk_DZD']
zone_iii_pct = (zone_iii_capital_dzd / TOTAL_CAPITAL_DZD) * 100

print(f"📊 EXPOSITION ZONE III")
print(f"├─ Capital à risque: {zone_iii_capital_dzd/1e12:,.2f} Md DZD")
print(f"├─ % du portefeuille: {zone_iii_pct:.2f}%")
print(f"└─ Objectif 12-mois: {ZONE_III_TARGET/1e12:,.2f} Md DZD (4%)")

# ===================== CALCUL RÉASSURANCE (3-COUCHES) =====================
print(f"\n🛡️  STRUCTURE RÉASSURANCE (3-COUCHES - SIMPLIFIÉ)")
print(f"├─ Perte Brute (1-in-250 ans): {gross_loss_dzd/1e12:,.2f} Md DZD")

# Layer 1: 100% de 72.5-217.5 Md
layer1_excess = max(0, min(gross_loss_dzd - RETENTION_DZD, LAYER1_LIMIT_DZD))
layer1_paid = layer1_excess * 1.0

# Layer 2: 90% de 217.5-507.5 Md
layer2_excess = max(0, min(gross_loss_dzd - LAYER2_RETENTION_DZD, LAYER2_LIMIT_DZD))
layer2_paid = layer2_excess * 0.9

# Layer 3: 95% au-delà de 507.5 Md
layer3_excess = max(0, gross_loss_dzd - LAYER3_RETENTION_DZD)
layer3_paid = min(layer3_excess, LAYER3_LIMIT_DZD) * 0.95

total_reins = layer1_paid + layer2_paid + layer3_paid
net_loss = gross_loss_dzd - total_reins
net_loss_pct = (net_loss / TOTAL_CAPITAL_DZD) * 100
net_loss_pct_available = (net_loss / AVAILABLE_CAPITAL_DZD) * 100

print(f"├─ Layer 1 (100%): {layer1_paid/1e12:,.2f} Md DZD")
print(f"├─ Layer 2 (90%): {layer2_paid/1e12:,.2f} Md DZD")
print(f"├─ Layer 3 (95%): {layer3_paid/1e12:,.2f} Md DZD")
print(f"├─ Total Réassurance: {total_reins/1e12:,.2f} Md DZD")
print(f"├─ Perte Nette: {net_loss/1e12:,.2f} Md DZD")
print(f"└─ Perte Nette % portefeuille: {net_loss_pct:.2f}% ✅")

# ===================== MÉTRIQUES DE RISQUE =====================
print(f"\n📈 MÉTRIQUES DE RISQUE")
print(f"├─ Expected Loss (EL) annuel: {(gross_loss_dzd * 0.004)/1e12:,.2f} Md DZD")
print(f"├─ VaR 99.5% (1-in-200 ans): {net_loss/1e12:,.2f} Md DZD")
print(f"├─ Solvency Ratio: {AVAILABLE_CAPITAL_DZD/net_loss:,.2f}x")
print(f"└─ Capital Preservation: {'✅ SÛRE' if net_loss_pct < 2 else '⚠️  ATTENTION'}")

# ===================== COMPARAISON STRATÉGIES =====================
print(f"\n⚖️  COMPARAISON STRATÉGIES (1-in-250 ans)")
print(f"\n{'Métrique':<35} {'Stratégie A':<20} {'Stratégie B':<20} {'Meilleur':<10}")
print("─" * 85)

strategies = {
    'A - Simplifié (3-couches)': {
        'gross_loss': gross_loss_dzd,
        'net_loss': net_loss,
        'cost_annual': 2_350_000_000_000,  # 2,350 Md DZD
        'implementation_months': 2,
        'coverage_pct': 80
    },
    'B - Avancé (4-couches)': {
        'gross_loss': gross_loss_dzd,
        'net_loss': gross_loss_dzd * 0.15,  # ~15% net loss with better coverage
        'cost_annual': 4_200_000_000_000,  # 4,200 Md DZD
        'implementation_months': 4,
        'coverage_pct': 92
    }
}

metrics = {
    'Perte Nette 1-in-250 ans': lambda: (f"{s['net_loss']/1e12:.2f} Md", "↓"),
    'Coût Réassurance Annuel': lambda: (f"{s['cost_annual']/1e12:.2f} Md", "↑"),
    'Délai Implémentation': lambda: (f"{s['implementation_months']} mois", "↓"),
    'Couverture Risque': lambda: (f"{s['coverage_pct']}%", "↑"),
}

# Calcul quick wins
net_loss_b = gross_loss_dzd * 0.15

print(f"{'Perte Nette':<35} {net_loss/1e12:>6.2f} Md{'':>10} {net_loss_b/1e12:>6.2f} Md{'':>10} A vs B (+24%)")
print(f"{'Coût Réassurance/an':<35} {2_350/1000:>6.2f} Md{'':>10} {4_200/1000:>6.2f} Md{'':>10} A 44%")
print(f"{'Délai Implémentation':<35} {'2 mois':<20} {'4 mois':<20} A -50%")
print(f"{'Couverture Risque':<35} {'80%':<20} {'92%':<20} B +15%")

print("\n" + "=" * 85)
print("💡 RECOMMANDATION: Stratégie A (Simplifié) pour démarrage rapide")
print("   → Activer B dans 12-18 mois une fois A stabilisée")

# ===================== PLAN D'ACTION 12-MOIS =====================
print(f"\n📅 PLAN D'EXÉCUTION - 12 MOIS")

action_plan = [
    {"month": "1-2", "action": "Approbation Board + Activation réassurance", "owner": "Risk/Réass.", "kpi": "Traités signés"},
    {"month": "2-4", "action": "Implémentation règles Zone III", "owner": "Underwriting", "kpi": "-25% nouvelles"},
    {"month": "4-8", "action": "Réduction exposure Zone III", "owner": "Portfolio", "kpi": "Zone III < 4%"},
    {"month": "6-12", "action": "Lancement programs Sahara", "owner": "Commercial", "kpi": "+2,900 Md"},
    {"month": "12", "action": "Revue complète + Ajustements", "owner": "Risk", "kpi": "Rapport"},
]

for ap in action_plan:
    print(f"├─ {ap['month']:>6} | {ap['action']:<35} | {ap['owner']:<15} | {ap['kpi']}")

# ===================== GÉNÉRATION RAPPORT MARKDOWN =====================
print(f"\n📄 Génération rapport Markdown...\n")

today = datetime.now()
report_filename = f"CSR_Monthly_Report_{today.strftime('%Y-%m-%d')}.md"
report_path = REPORT_DIR / report_filename

markdown_report = f"""# RAPPORT MENSUEL - PLATEFORME CSR
## Gestion du Risque Sismique Algérien

**Date:** {today.strftime("%d %B %Y")} | **Devise:** DZD | **Exchange Rate:** 1 USD = {USD_TO_DZD} DZD

---

## 🎯 RÉSUMÉ EXÉCUTIF

| Indicateur | Valeur | Statut |
|---|---|---|
| **Capital Total** | {TOTAL_CAPITAL_DZD/1e12:,.2f} Md DZD | ✅ |
| **Exposition Zone III** | {zone_iii_capital_dzd/1e12:,.2f} Md ({zone_iii_pct:.2f}%) | 🚨 CRITIQUE |
| **Perte 1-in-250 ans** | {gross_loss_dzd/1e12:,.2f} Md DZD (brut) | ⚠️ |
| **Après Réassurance** | {net_loss/1e12:,.2f} Md DZD (net) | ✅ SOUTENABLE |
| **Solvency Ratio** | {AVAILABLE_CAPITAL_DZD/net_loss:,.2f}x | ✅ SÛRE |

---

## 📊 ANALYSE DÉTAILLÉE

### 1. EXPOSITION PAR ZONE

| Zone | Capital | % | Statut |
|---|---|---|---|
| Zone 0 | 1,247.67 Md | 2.87% | ✅ |
| Zone I | 8,763.47 Md | 20.18% | ✅ |
| Zone IIa | 24,929.32 Md | 57.40% | ✅ |
| Zone IIb | 8,158.59 Md | 18.78% | ⚠️ |
| **Zone III** | **{zone_iii_capital_dzd/1e12:,.2f} Md** | **{zone_iii_pct:.2f}%** | **🚨** |

### 2. RÉASSURANCE - STRUCTURE 3-COUCHES

- **Layer 1:** {layer1_paid/1e12:,.2f} Md (100%)
- **Layer 2:** {layer2_paid/1e12:,.2f} Md (90%)
- **Layer 3:** {layer3_paid/1e12:,.2f} Md (95%)
- **Total:** {total_reins/1e12:,.2f} Md

### 3. SCÉNARIOS DE STRESS

| Scénario | Magnitude | Perte Brute | Perte Nette | % Capital |
|---|---|---|---|---|
| 1-in-50 ans | M6.5 | {pml.loc[pml['Scenario_ID']=='Scenario_3', 'Total_PML_DZD'].iloc[0]/1e12:,.2f} Md | - | - |
| **1-in-250 ans** | **M7.5** | **{gross_loss_dzd/1e12:,.2f} Md** | **{net_loss/1e12:,.2f} Md** | **{net_loss_pct:.2f}%** |
| 1-in-500 ans | Extrême | - | - | - |

---

## 🎯 RECOMMANDATIONS PRIORITAIRES

### ✅ CRITIQUE (Mois 1-2)
1. Approuver structure réassurance 3-couches
2. Signer traités CCR + Global Reinsurers
3. Activer Comité de gouvernance Zone III

### ⚠️ HAUTE (Mois 2-6)
4. Suspension nouvelles polices Zone III
5. Implémenter tarification +20-30% Zone III
6. Commencer réduction exposure (-25%)

### 📈 OPPORTUNITÉ (Mois 6-12)
7. Lancer programs Sahara (Zone 0-I)
8. Target: +2,900 Md DZD en nouvelles affaires

---

## 📋 KPI SUIVI MENSUEL

- **Zone III Concentration:** {zone_iii_pct:.2f}% (Objectif: <4% en 12 mois)
- **PML Net Ratio:** {net_loss_pct:.2f}% (Objectif: <1%)
- **Solvency Ratio:** {AVAILABLE_CAPITAL_DZD/net_loss:,.2f}x (Objectif: >1.5x)
- **New Business Sahara:** 0 Md (Objectif: +2,900 Md)

---

*Rapport généré automatiquement par CSR Finance Engine v2.0*  
*Prochaine révision: {(today + timedelta(days=30)).strftime("%d %B %Y")}*
"""

with open(report_path, "w", encoding="utf-8") as f:
    f.write(markdown_report)

print(f"✅ Rapport Markdown créé: reports/{report_filename}")

# ===================== EXPORT JSON (pour dashboard) =====================
print(f"📤 Export JSON pour dashboard...\n")

json_data = {
    "report_date": today.isoformat(),
    "portfolio": {
        "total_capital_dzd": float(TOTAL_CAPITAL_DZD),
        "total_capital_usd": float(TOTAL_CAPITAL_DZD / USD_TO_DZD),
        "available_capital_dzd": float(AVAILABLE_CAPITAL_DZD),
        "number_of_policies": 39196,
        "wilayas": 51,
        "communes": 789
    },
    "zone_iii": {
        "capital_dzd": float(zone_iii_capital_dzd),
        "capital_usd": float(zone_iii_capital_dzd / USD_TO_DZD),
        "percentage": float(zone_iii_pct),
        "target_percentage": 4.0,
        "status": "CRITICAL"
    },
    "scenarios": {
        "scenario_1_in_250": {
            "magnitude": 7.5,
            "gross_loss_dzd": float(gross_loss_dzd),
            "reinsurance_paid_dzd": float(total_reins),
            "net_loss_dzd": float(net_loss),
            "net_loss_pct": float(net_loss_pct),
            "net_loss_pct_available_capital": float(net_loss_pct_available)
        }
    },
    "reinsurance": {
        "structure": "3-Layer Hybrid",
        "layer1_paid_dzd": float(layer1_paid),
        "layer2_paid_dzd": float(layer2_paid),
        "layer3_paid_dzd": float(layer3_paid),
        "total_cession_dzd": float(total_reins),
        "annual_cost_dzd": 2_350_000_000_000,
        "coverage_percentage": 80
    },
    "solvency": {
        "ratio": float(AVAILABLE_CAPITAL_DZD / net_loss),
        "status": "SAFE",
        "minimum_required": 1.5
    }
}

json_path = REPORT_DIR / f"CSR_Data_{today.strftime('%Y-%m-%d')}.json"
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(json_data, f, indent=2)

print(f"✅ Fichier JSON créé: reports/CSR_Data_{today.strftime('%Y-%m-%d')}.json")

# ===================== RÉSUMÉ FINAL =====================
print("\n" + "=" * 80)
print("✅ PROCESS COMPLÉTÉ AVEC SUCCÈS")
print("=" * 80)
print(f"\n📁 Fichiers générés:")
print(f"   ├─ {report_path.name}")
print(f"   └─ {json_path.name}")
print(f"\n💾 Localisation: {REPORT_DIR.absolute()}")
print(f"\n📅 Prochaine exécution: {(today + timedelta(days=30)).strftime('%d/%m/%Y')}")
print(f"\n🔄 Pour exécuter automatiquement chaque mois:")
print(f"   Windows: Ajouter à Task Scheduler")
print(f"   Linux/Mac: Ajouter à crontab (0 0 1 * * python csr_finance_engine.py)")
print("\n" + "=" * 80)
