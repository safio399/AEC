# DATA DICTIONARY - CATNAT Seismic Resilience Platform

**Version:** 1.0  
**Date:** April 17, 2026  
**Source:** CATNAT_2023_2025.csv + Phase 0 Enrichment  
**Audience:** Data Scientists, Analysts, Business Users

---

## Original Dataset Columns (from CATNAT_2023_2025.csv)

### NUMERO_POLICE

- **Type:** String (Integer)
- **Description:** Unique insurance policy identification number
- **Example:** 16330013230012
- **Format:** 14-digit alphanumeric code
- **Uniqueness:** PRIMARY KEY (with caveats for duplicates representing policy amendments)
- **Missing Values:** 0

### CODE_SOUS_BRANCHE

- **Type:** Integer
- **Description:** Sub-branch classification code (insurance product line)
- **Example:** 3302
- **Range:** 3000–3999 (typical for CATNAT coverage)
- **Missing Values:** 0
- **Business Logic:** Identifies specific earthquake insurance product sub-class

### NUM_AVNT_COURS

- **Type:** Integer
- **Description:** Current amendment/endorsement number for policy version tracking
- **Example:** 0 (original policy), 1+ (amendments)
- **Range:** 0–N
- **Missing Values:** 0
- **Business Logic:** Tracks policy modifications; versions counted separately in dataset

### DATE_EFFET

- **Type:** Date
- **Description:** Policy effective date (coverage start date)
- **Format:** DD/MM/YYYY
- **Example:** 03/01/2023
- **Range:** Dec 2022 – May 2024 (as of dataset snapshot)
- **Missing Values:** 0

### DATE_EXPIRATION

- **Type:** Date
- **Description:** Policy expiration date (coverage end date)
- **Format:** DD/MM/YYYY
- **Example:** 02/01/2024
- **Range:** Dec 2022 – May 2024+
- **Missing Values:** 0
- **Business Logic:** Policies active if DATE_EXPIRATION > TODAY()

### TYPE

- **Type:** String (Categorical)
- **Description:** Coverage type / property class
- **Values:**
  - `1 - Installation Industrielle` → Industrial installations
  - `2 - Installation Commerciale` → Commercial installations
  - `3 - Bien immobilier` → Real estate (residential/office buildings)
- **Distribution (from EDA):**
  - Industrial: ~15%
  - Commercial: ~20%
  - Real Estate: ~65%
- **Missing Values:** 0
- **Business Logic:** PRIMARY segmentation dimension; drives vulnerability scoring

### WILAYA

- **Type:** String
- **Description:** Province name (administrative division) with embedded code
- **Format:** `{CODE} - {NAME}`
- **Example:** `9 - BLIDA` or `12 - ALGIERS`
- **Missing Values:** ~53 (0.14%) – rare
- **Related Field:** Extract `WILAYA_CODE` from this for RPA zoning lookup

### COMMUNE

- **Type:** String
- **Description:** Municipal subdivision name with embedded code
- **Format:** `{CODE} - {NAME}`
- **Example:** `111 - BIRTOUTA`
- **Missing Values:** ~18 (0.05%) – rare
- **Related Field:** Extract `COMMUNE_CODE` from this
- **Business Logic:** 789 unique communes in dataset; level of granularity for concentration analysis

### CAPITAL_ASSURE

- **Type:** Float (Currency: USD)
- **Description:** Sum insured / policy limit (maximum covered amount)
- **Example:** 1,000,000 (= $1M)
- **Range:** $93,000 – $8,389,997,969
- **Mean:** $7,642,358
- **Median:** $2,484,030
- **Std Dev:** $115,089,080 (right-skewed)
- **Missing Values:** 1 (0.00%)
- **Business Logic:** Core exposure metric; aggregated for concentration, PML, and capital adequacy analysis

### PRIME_NETTE

- **Type:** Float (Currency: USD; Decimal separator: comma in CSV)
- **Description:** Net premium (insured's cost before reinsurance/taxes)
- **Example:** 2500.00 (= $2,500)
- **Range:** -$1,605,315.75 – $8,268,112.47 (includes abnormal values)
- **Mean:** $3,735.75
- **Median:** $2,115.75
- **Missing Values:** 0
- **Data Quality Issues (flagged in Phase 0):**
  - ~1.2% negative premiums (policy cancellations/credits)
  - ~0.1% zero premiums (rare/free coverage or data errors)
- **Business Logic:** Used for premium concentration analysis; flagged records need review
- **Note:** Comma decimal in CSV must be handled during import (pandas decimal=','parameter)

---

## Enriched Dataset Columns (Added in Phase 0)

### WILAYA_CODE

- **Type:** Integer
- **Description:** Extracted numeric code for province (1–51)
- **Example:** 9 (BLIDA), 12 (ALGIERS)
- **Range:** 1–51 (Algeria has 51 administrative provinces)
- **Source:** Parsed from `WILAYA` column
- **Missing Values:** ~53 (same as WILAYA missing)
- **Business Logic:** KEY for merging with rpa_zoning.csv lookup table

### COMMUNE_CODE

- **Type:** Integer
- **Description:** Extracted numeric code for commune
- **Example:** 111 (BIRTOUTA), 368 (BORDJ BOU ARRERIDJ)
- **Range:** 1–various (typically 1–200 per wilaya)
- **Source:** Parsed from `COMMUNE` column
- **Missing Values:** ~18 (same as COMMUNE missing)
- **Business Logic:** Supports commune-level concentration analysis and GIS mapping

### ZONE_SISMIQUE

- **Type:** String (Categorical)
- **Description:** RPA 99/Version 2003 seismic zone (5 zones: 0/I/IIa/IIb/III)
- **Values:**
  - `0` → Zone 0 (Very Low seismic activity) – acceleration < 0.04g
  - `I` → Zone I (Low) – acceleration 0.04–0.08g
  - `IIa` → Zone IIa (Medium-High) – acceleration 0.08–0.12g
  - `IIb` → Zone IIb (High) – acceleration 0.12–0.20g
  - `III` → Zone III (Very High) – acceleration > 0.20g
- **Source:** Lookup from `rpa_zoning.csv` using WILAYA_CODE match
- **Coverage:** 100% (39,196 / 39,196)
- **Distribution:**
  - Zone 0: ~5% (Saharan wilayas)
  - Zone I: ~15%
  - Zone IIa: ~35%
  - Zone IIb: ~25%
  - Zone III: ~20% (HIGH PRIORITY - includes Algiers, Boumerdes, Tizi Ouzou)
- **Business Logic:** PRIMARY risk dimension; critical for regulatory compliance (RPA 99), PML scenarios, and concentration thresholds

### RISK_LEVEL

- **Type:** String (Categorical)
- **Description:** Qualitative risk descriptor (human-readable version of ZONE_SISMIQUE)
- **Mapping:**
  - Zone 0 → `Very Low`
  - Zone I → `Low`
  - Zone IIa → `Medium-High`
  - Zone IIb → `High`
  - Zone III → `Very High`
- **Source:** Lookup from `rpa_zoning.csv`
- **Business Logic:** Used in dashboards and reports for non-technical stakeholders

### VULNERABILITY_SCORE

- **Type:** Float
- **Description:** Composite vulnerability index (0–1 scale) combining structure type + seismic zone
- **Formula:**
  ```
  VULNERABILITY_SCORE = TYPE_BASE_SCORE × ZONE_MULTIPLIER
  where:
    TYPE_BASE_SCORE:
      Industrial = 0.8 (highest vulnerability)
      Commercial = 0.6
      Real Estate = 0.4 (baseline)

    ZONE_MULTIPLIER (RPA Chapter IX):
      Zone 0 = 0.2x
      Zone I = 0.4x
      Zone IIa = 0.6x
      Zone IIb = 0.8x
      Zone III = 1.0x (maximum)
  ```
- **Example Scores:**
  - Industrial in Zone III: 0.8 × 1.0 = **0.80** (highest risk)
  - Commercial in Zone IIb: 0.6 × 0.8 = **0.48**
  - Real Estate in Zone I: 0.4 × 0.4 = **0.16** (lowest risk)
- **Range:** 0.08–0.80 (theoretical: 0–1)
- **Mean:** ~0.35
- **Business Logic:**
  - Used for PML calculations
  - Input to risk-based underwriting rules
  - Weighting factor for concentration alerts
- **Limitations:**
  - Proxy-based (no actual building data available)
  - Does not account for: age, construction quality, retrofits, location microzonation
  - Recommend Phase II enhancement with building-level attributes

### POLICY_STATUS

- **Type:** String (Categorical)
- **Description:** Classification of policy lifecycle status
- **Values:**
  - `ACTIVE` → Policy currently in force (DATE_EXPIRATION > TODAY)
  - `EXPIRED` → Policy has lapsed (DATE_EXPIRATION ≤ TODAY)
  - `FLAGGED` → Policy requires review (e.g., invalid premium)
- **Distribution (example):**
  - ACTIVE: ~95%
  - EXPIRED: ~4%
  - FLAGGED: ~1%
- **Source:** Derived from DATE_EXPIRATION and PREMIUM_FLAG in Phase 0
- **Business Logic:** Filtering for active exposure calculations

### PREMIUM_FLAG

- **Type:** String (Categorical)
- **Description:** Data quality flag for premium values
- **Values:**
  - `VALID` → Premium meets validation rules
  - `INVALID` → Negative or zero premium requiring investigation
- **Count (INVALID):** ~478 records (1.2%)
- **Business Logic:**
  - Filter out for revenue calculations
  - Flag for actuarial review (may indicate policy cancellations or data entry errors)

---

## Derived Aggregation Columns (for Analysis)

### Concentration Metrics (per Commune/Wilaya)

- **CAPITAL_CUMULE:** Sum of CAPITAL_ASSURE by geography
- **POLICY_CUMULE:** Count of policies by geography
- **PREMIUM_CUMULE:** Sum of PRIME_NETTE by geography
- **PCT_TOTAL_CAPITAL:** Percentage of company's total capital in this geography
- **CONCENTRATION_FLAG:**
  - `CRITICAL` if PCT_TOTAL_CAPITAL ≥ 2.0%
  - `HIGH` if PCT_TOTAL_CAPITAL ≥ 1.0%
  - `OK` otherwise

### Risk Indicators

- **VULNERABILITY_WEIGHTED_CAPITAL:** CAPITAL_ASSURE × VULNERABILITY_SCORE
- **RISK_SCORE:** (CAPITAL_ASSURE × VULNERABILITY_SCORE) / ZONE_ACCELERATION
- **CONCENTRATION_RATIO:** CAPITAL_CUMULE / ZONE_RISK_LEVEL

---

## Key Statistics & Validation Rules

### Capital Assurance

- **Total:** $299,536,485,393 (~$299.5B)
- **Min:** $93,000
- **Max:** $8,389,997,969 (requires validation – possible outlier)
- **Mean:** $7,642,358
- **Median:** $2,484,030
- **Std Dev:** $115,089,080 (highly skewed – typical for insurance)

### Geographic Segmentation

- **Wilayas:** 51 / 51 (100%)
- **Communes:** 789 / 789 (100% coverage in dataset)
- **Top Wilaya (by capital):** ALGIERS (Zone III) – ~15% of total
- **Top Wilaya (by policy count):** TIZI OUZOU (Zone III) – ~8% of policies

### Policy Distribution

- **Total Policies:** 39,196
- **By Type:**
  - Real Estate: 65% (residential/commercial buildings)
  - Commercial: 20%
  - Industrial: 15%
- **Active Policies:** ~95%
- **Expired Policies:** ~4%
- **Flagged Policies:** ~1%

### Seismic Zone Distribution

- **Zone III (Very High Risk):** ~20% of capital / ~25% of policies
  - **High-Risk Wilayas:** BLIDA (9), BOUMERDES (10), TIZI OUZOU (11), ALGIERS (12)
  - **Concentration Alert:** >15% of capital in Zone III considered excessive (domain expert input needed)

---

## Data Quality Checks

| Check                          | Status      | Action                                  |
| ------------------------------ | ----------- | --------------------------------------- |
| Missing WILAYA_CODE            | ~0.14%      | Keep; flag for imputation               |
| Missing COMMUNE_CODE           | ~0.05%      | Keep; flag for imputation               |
| Negative PRIME_NETTE           | ~0.5%       | Flagged; review with accounting         |
| Zero PRIME_NETTE               | ~0.1%       | Flagged; likely free/test policies      |
| CAPITAL > $8B                  | ~5 records  | Flagged; validate against manual review |
| DATE_EFFET > DATE_EXPIRATION   | 0           | ✓ Valid                                 |
| RPA Zone mapping               | 100%        | ✓ Complete                              |
| Policy duplicates (amendments) | ~3,571 rows | ✓ Expected; kept in dataset             |

---

## Export Formats

### Primary Format: Parquet

- **File:** `portfolio_enriched.parquet`
- **Compression:** Snappy
- **Size:** ~15 MB (compressed)
- **Advantage:** Efficient, schema preservation, speed
- **Use:** Data science workflows, Spark, data lakes

### Secondary Format: CSV

- **File:** `portfolio_enriched.csv`
- **Encoding:** UTF-8
- **Decimal:** Comma (European format: "2500,00" for 2500.00)
- **Size:** ~20 MB
- **Advantage:** Universal compatibility, Excel, Excel
- **Use:** End-user reports, ad-hoc analysis, PowerBI

### GIS Format: GeoJSON

- **File:** `portfolio_hotspots.geojson` (Phase I)
- **Features:** Commune polygons + heatmap properties
- **Attributes:** WILAYA, COMMUNE, CAPITAL_CUMULE, VULNERABILITY_AVG
- **Use:** Interactive maps, Leaflet/Mapbox

---

## Phase 0 Output Files

| File                       | Records | Columns | Purpose                    |
| -------------------------- | ------- | ------- | -------------------------- |
| portfolio_enriched.parquet | 39,196  | 16      | Primary analysis dataset   |
| portfolio_enriched.csv     | 39,196  | 16      | CSV export for Excel/BI    |
| hotspots_identified.csv    | 20+     | 7       | Top concentration communes |
| phase0_quality_metrics.csv | 11      | 2       | QA summary                 |

---

## Glossary

- **CATNAT:** French insurance classification for natural disaster coverage (Catastrophes Naturelles)
- **RPA 99:** Algerian seismic code (Règlement Parasismique Algérien 1999, Version 2003)
- **Wilaya:** Province/administrative region in Algeria (51 total)
- **Commune:** Municipal subdivision (789 across all wilayas)
- **Seismic Zone:** Geographic region classified by earthquake risk (0–III)
- **Sum Insured (Capital Assuré):** Maximum amount insurer will cover
- **Net Premium (Prime Nette):** Insured's cost before taxes/reinsurance
- **Vulnerability Score:** Composite risk metric (structure type × seismic zone)
- **Concentration:** Geographic clustering of high capital exposure
- **PML (Probable Maximum Loss):** Worst-case financial impact scenario

---

**Version History:**

- v1.0 – April 17, 2026 – Initial Phase 0 completion
