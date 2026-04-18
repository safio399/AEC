# CATNAT Seismic Resilience Platform - PHASE ROADMAP

**Project:** Seismic Risk Exposure Assessment & Portfolio Optimization System  
**Duration:** 12–16 weeks  
**Status:** ✅ PHASE 0 COMPLETE | 🚀 PHASE I READY  
**Last Updated:** April 17, 2026

---

## 📅 TIMELINE OVERVIEW

```
PHASE 0 (Week 1–2): ✅ COMPLETE
├─ Data cleaning & standardization
├─ RPA zoning integration
├─ Vulnerability scoring
└─ Concentration analysis

PHASE I (Week 3–4): 🚀 READY TO START
├─ Risk identification & classification
├─ PML simulation
└─ GIS mapping layer

PHASE II (Week 5–8): 📋 PLANNED
├─ Advanced portfolio analysis
├─ REST API development
└─ Interactive dashboards

PHASE III (Week 9–12): 📋 PLANNED
├─ 3 Required Livrables
└─ Strategic recommendations

PHASE IV (Week 13–16): 📋 PLANNED
├─ Production deployment
├─ RBAC & authentication
└─ Automated refresh
```

---

## PHASE 0: Project Setup & Data Foundation ✅

**Duration:** Week 1–2  
**Status:** ✅ COMPLETE

### Objectives

- [x] Establish monorepo structure (/data, /notebooks, /backend, /frontend, /gis)
- [x] Clean and standardize CATNAT dataset
- [x] Create RPA 99/Version 2003 zoning lookup table
- [x] Map 100% of policies to seismic zones
- [x] Calculate vulnerability scores
- [x] Identify surconcentration hotspots

### Deliverables ✅

| Deliverable                                | Status | Location   |
| ------------------------------------------ | ------ | ---------- |
| portfolio_enriched.parquet                 | ✅     | data/      |
| portfolio_enriched.csv                     | ✅     | data/      |
| rpa_zoning.csv (51 wilayas)                | ✅     | data/      |
| hotspots_identified.csv                    | ✅     | data/      |
| Phase_0_Data_Cleaning_and_Enrichment.ipynb | ✅     | notebooks/ |
| README.md                                  | ✅     | docs/      |
| DATA_DICTIONARY.md                         | ✅     | docs/      |
| Backend skeleton (FastAPI)                 | ✅     | backend/   |

### Key Metrics

| Metric             | Value    |
| ------------------ | -------- |
| Policies Processed | 39,196   |
| Data Quality       | 94.4%    |
| RPA Coverage       | 100%     |
| Wilayas Mapped     | 51/51    |
| Communes Mapped    | 789/789  |
| Execution Time     | ~2–5 min |

### Team Responsibilities (PHASE 0)

- **Data Scientists:** ✅ Data cleaning, RPA integration, vulnerability scoring
- **Software Engineers:** ✅ Repo setup, ETL skeleton, requirements.txt
- **GIS Specialist:** ⏳ Pending (Phase I: vector layer creation)
- **Domain Expert:** ⏳ Validation phase (scheduled for Phase I kickoff)

### Success Criteria ✅

- [x] All policies mapped to RPA zones (100% coverage)
- [x] Data quality issues documented
- [x] Vulnerability model implemented (RPA Chapter IX rules)
- [x] Hotspots identified (top 20 surconcentration)
- [x] Outputs ready for Phase I analysis

### Known Limitations & Next Steps

| Issue                              | Status     | Phase I Action                                         |
| ---------------------------------- | ---------- | ------------------------------------------------------ |
| No building-level data             | ℹ️ Known   | Use TYPE + ZONE proxies; recommend Phase II enrichment |
| Missing geographic codes           | ✅ Handled | Flagged for imputation; 100% RPA coverage achieved     |
| Vulnerability model is proxy-based | ℹ️ Known   | Validate with domain experts; refine based on feedback |
| Limited to deterministic PML       | ℹ️ Known   | Phase II: probabilistic modeling (1-in-250 years)      |

---

## PHASE I: Risk Identification & Classification (Socle RPA) 🚀

**Duration:** Week 3–4 (2 weeks)  
**Status:** 🚀 READY TO COMMENCE

### Objectives

1. **GIS Mapping Layer**
   - Vectorize RPA seismic zones (polygons: Zone 0/I/IIa/IIb/III)
   - Create portfolio heatmap overlay (bubble/choropleth by capital)
   - Interactive filters: TYPE, ZONE, date range
   - Clickable communes → risk score details

2. **Deterministic PML Simulation**
   - Scenario: "Séisme majeur sur zone critique" (e.g., Zone III Boumerdes)
   - RPA acceleration coefficients (A) + damage ratios by TYPE/zone
   - Calculate theoretical loss: Loss = Σ(CAPITAL × VULNERABILITY × DAMAGE_RATIO)
   - Generate sensitivity analysis (vary magnitude, location)

3. **Risk Indicators Dashboard**
   - % capital per zone (bar chart)
   - Top 20 hotspots (sortable table)
   - Vulnerability distribution (histogram)
   - Concentration ratios (scatter plot)

### Deliverables (Phase I)

| Item                              | Owner              | Status | Note                   |
| --------------------------------- | ------------------ | ------ | ---------------------- |
| GIS layer (RPA zones + portfolio) | GIS Specialist     | TODO   | Folium/Leaflet         |
| PML scenario report               | Data Scientists    | TODO   | Deterministic models   |
| Risk indicators dashboard         | Software Engineers | TODO   | Streamlit POC          |
| Interactive map                   | Frontend           | TODO   | Leaflet.js / Mapbox GL |
| Phase_1_Risk_Identification.ipynb | Data Scientists    | TODO   |                        |

### Task Breakdown

#### Data Scientists (Week 3–4)

- [ ] Load portfolio_enriched.parquet
- [ ] Define PML scenario parameters:
  - Earthquake magnitude (M7.0–7.5)
  - Location (focus Zone III wilayas)
  - Damage ratios by TYPE (% of capital at risk)
- [ ] Calculate PML:
  ```
  PML = Σ(CAPITAL_ASSURE[i] × VULNERABILITY_SCORE[i] × DAMAGE_RATIO[zone])
  ```
- [ ] Generate scenario report (CSV + markdown)
- [ ] Create vulnerability validation tables (coordinate with domain expert)
- [ ] Output: pml_scenarios.csv, risk_indicators.parquet

#### GIS Specialist (Week 3–4)

- [ ] Obtain/digitize Algerian wilaya/commune boundaries (shapefile)
- [ ] Source RPA zoning map (official or reconstruct from Annexe 1)
- [ ] Convert to GeoJSON:
  - `rpa_zones.geojson` (zone polygons + properties)
  - `wilaya_communes.geojson` (admin boundaries)
- [ ] Create mapping configuration (layer ordering, colors, labels)
- [ ] Validate overlay with portfolio heatmap

#### Software Engineers (Week 3–4)

- [ ] Create Phase I notebook with visualization code
- [ ] Build FastAPI endpoints:
  - GET /api/risk/pml-scenario (with parameters)
  - GET /api/risk/zone-iii-focus ✓ (already in skeleton)
  - GET /api/risk/vulnerability-distribution
- [ ] Prototype Streamlit dashboard with charts
- [ ] Setup CI/CD pipeline (GitHub Actions template)

### API Additions (Phase I)

```python
# POST /api/pml/simulate-scenario
{
  "zone": "III",
  "magnitude": 7.5,
  "location_wilaya": "10 - BOUMERDES",
  "damage_ratio_industrial": 0.35,
  "damage_ratio_commercial": 0.25,
  "damage_ratio_realestate": 0.15
}
Response: {
  "scenario_id": "scenario_20260420_001",
  "zone": "III",
  "pml_total": 45000000000,  # $45B worst-case
  "capital_at_risk": 120000000000,
  "affected_policies": 8500,
  "recommendation": "Urgent: reduce concentration in Boumerdes Zone III"
}

# GET /api/risk/vulnerability-distribution
Response: {
  "bins": [0.0, 0.1, 0.2, ..., 1.0],
  "counts": [1200, 3400, 5200, ...],
  "mean": 0.35,
  "std": 0.22
}
```

### Success Criteria (Phase I)

- [ ] GIS map displays RPA zones with portfolio overlay
- [ ] PML scenario for Zone III produces actionable financial impact
- [ ] Vulnerability model validated by domain expert
- [ ] Dashboard shows top 20 hotspots with concentration flags
- [ ] All outputs ready for Phase II advanced analysis

---

## PHASE II: Portfolio Analysis & Concentration (Weeks 5–8) 📋

### Objectives

1. **Advanced Segmentation**
   - By TYPE × ZONE × WILAYA (3D analysis)
   - Pyramid charts (hierarchical breakdown)
   - Dynamic slicing/filtering

2. **REST API Expansion**
   - Spatial queries via PostGIS (if DB implemented)
   - Portfolio aggregates endpoint
   - Scenario comparison endpoint

3. **Interactive Dashboards**
   - Streamlit multi-page app:
     - Overview (KPIs)
     - Geographic (maps + concentration table)
     - Risk (vulnerability distribution + PML scenarios)
     - Recommendations (policy rules + export)
   - Power BI / Tableau (enterprise option)

4. **Database Setup (Optional, Phase II+)**
   - PostgreSQL + PostGIS
   - Monthly CSV refresh pipeline
   - Historical tracking (version control)

### Deliverables (Phase II)

- portfolio_analysis_detailed.ipynb
- Streamlit dashboard (multi-page)
- FastAPI endpoints (advanced queries)
- Database schema (if PostgreSQL selected)
- Phase_2_Concentration_Analysis.ipynb

### Key Tasks

- [ ] Implement 3D pivot tables (TYPE × ZONE × WILAYA)
- [ ] Advanced concentration ratios (capital/policy density)
- [ ] Stress testing scenarios (capital reduction targets)
- [ ] Build Streamlit app with Plotly/Altair visualizations
- [ ] Integrate map layer from Phase I
- [ ] Document API for future integration

---

## PHASE III: Diagnosis, Recommendations & Deliverables (Weeks 9–12) 📋

### 3 Required Livrables (from CDC)

#### Deliverable 1: Rapport de Cartographie (GIS Report) 📍

**Owner:** GIS Specialist + Software Engineers  
**Format:** Interactive web map (HTML/Leaflet) + PDF export  
**Contents:**

- RPA seismic zoning map (base layer, color-coded 0–III)
- Portfolio heatmap overlay:
  - Bubble size = CAPITAL_ASSURE
  - Color intensity = VULNERABILITY_SCORE × CONCENTRATION
  - Commune-level drill-down
- Filters: TYPE, ZONE, date range
- Clickable markers → risk profile, recommendations
- Legend + basemap (OpenStreetMap, satellite option)

**Output:**

```
/frontend/reports/carte_concentration_sismique.html (interactive)
/frontend/reports/carte_concentration_sismique.pdf (static)
```

#### Deliverable 2: Tableau de Bord des Cumuls (Dashboard) 📊

**Owner:** Software Engineers + Data Scientists  
**Platform:** Streamlit (POC) → Dash/Power BI (production)  
**Sections:**

1. **Executive Summary (KPIs)**
   - Total capital: $299.5B
   - % in Zone III: 20%
   - Surconcentration alerts: 12 communes
   - Action items: [Top 3 recommendations]

2. **Portfolio Overview**
   - Pie: % capital by TYPE
   - Bar: % capital by ZONE
   - Trend: Premium vs. capital over time

3. **Geographic Analysis**
   - Table: Top 20 wilayas (capital, policies, vulnerability)
   - Heatmap: Concentration by WILAYA × ZONE
   - Map: Filtered by user selection

4. **Risk Metrics**
   - Vulnerability distribution (histogram)
   - Concentration ratio by zone (scatter)
   - PML scenarios (comparison table)
   - Recommendations by zone/type

5. **Drill-Down & Filters**
   - Slicers: Wilaya, Type, Zone, Date Range
   - Export: Selected data to Excel/CSV

**Output:**

```
/frontend/streamlit_dashboard.py
Deployment: http://localhost:8501/
```

#### Deliverable 3: Note de Recommandation Stratégique (Strategic Note) 📄

**Owner:** Data Scientists + Domain Expert  
**Format:** PDF + Markdown  
**Structure:**

```
1. EXECUTIVE SUMMARY (1 page)
   - Key findings
   - Top 3 surconcentration zones
   - Recommended actions

2. PORTFOLIO EXPOSURE ANALYSIS (3 pages)
   - Capital by zone (charts + tables)
   - Type distribution (industrial vs. commercial vs. real estate)
   - Geographic concentration patterns
   - Top 20 hotspots

3. RISK ASSESSMENT (3 pages)
   - Vulnerability scoring model
   - PML scenario results (Zone III earthquake)
   - Financial impact analysis
   - Stress testing (if capital reduced by X%)

4. STRATEGIC RECOMMENDATIONS (4 pages)

   A. SURCONCENTRATION MITIGATION (Assainissement)
      Zone III: "Reduce concentration in Algiers/Boumerdes by 25%"
      - Suspension of new underwriting in top 5 communes (12–24 months)
      - Premium rate increases (10–20% by zone/type)
      - Reinsurance layer adjustment
      - Capital reduction targets: $X billion → $Y billion

   B. SOUS-CONCENTRATION OPPORTUNITIES (Balance Actions)
      Zone I: "Expand presence in underserved regions"
      - Open new markets: ADRAR, ILLIZI (Zone 0)
      - Target: +$1B capital in Zone 0/I (low risk)
      - Pilot programs (commercial + industrial)

   C. UNDERWRITING POLICY RULES
      - By Zone:
        Zone 0/I: Standard terms, no restrictions
        Zone IIa: Standard + 5% premium loading
        Zone IIb: 10% loading + exposure cap per commune
        Zone III: 25% loading + strict exposure limits + mandatory reinsurance
      - By Type:
        Industrial: Higher vulnerability → 15% loading in Zone IIb/III
        Commercial: 10% loading
        Real Estate: Standard

   D. REINSURANCE STRATEGY
      - Current Layer 1: Retention $X, Limit $Y (Zone 0–IIa)
      - Proposed Layer 1: Adjusted retention for Zone IIb/III
      - New Layer 2: Excess loss layer for Zone III catastrophe
      - Estimated cost: $X million annually

   E. MONITORING & GOVERNANCE
      - Quarterly portfolio reviews (concentration alerts)
      - Annual RPA compliance audit
      - PML recalculation (trigger: >5% portfolio change)
      - Stress testing (annual, ad-hoc as needed)

5. APPENDICES (10 pages)
   - Technical methodology (vulnerability scoring)
   - RPA 99 zone definitions
   - Data quality report
   - Detailed hotspots table (100+ communes)
   - Glossary + references

TOTAL: ~20–25 pages (PDF)
Output: /frontend/reports/Note_Recommandation_Strategique_CSR_2026Q2.pdf
```

### Deliverable Output Format

```
/frontend/reports/
├── carte_concentration_sismique.html         [Deliverable 1]
├── carte_concentration_sismique.pdf          [Deliverable 1]
├── Tableau_de_Bord_des_Cumuls/
│   ├── streamlit_dashboard.py                [Deliverable 2]
│   └── exports/
│       ├── portfolio_summary.xlsx
│       ├── hotspots_table.xlsx
│       └── vulnerability_analysis.xlsx
└── Note_Recommandation_Strategique_CSR_2026Q2.pdf  [Deliverable 3]
```

### Phase III Timeline

- **Week 9–10:** Finalize GIS map (Deliverable 1), validation with GIS expert
- **Week 10–11:** Dashboard completion (Deliverable 2), stakeholder review
- **Week 11–12:** Strategic note drafting (Deliverable 3), domain expert sign-off, final PDFs

### Success Criteria (Phase III)

- [ ] All 3 livrables delivered on schedule
- [ ] Maps are interactive + exportable to PDF
- [ ] Dashboard accessible to risk team (no additional setup)
- [ ] Strategic note has actionable recommendations accepted by executives
- [ ] All outputs validated by domain expert

---

## PHASE IV: Production, Deployment & Handover (Weeks 13–16) 🚀

### Objectives

1. **Containerization**
   - Docker image for backend (FastAPI)
   - Docker Compose for full stack (backend + frontend + database)
   - Health checks + logging

2. **Production Deployment**
   - Choose platform: AWS/Azure/GCP or on-premises (Algeria)
   - Setup HTTPS, domain, DNS
   - Database backup strategy
   - Monitoring + alerting (optional: New Relic, DataDog)

3. **Security & Access Control**
   - User authentication (OAuth2, LDAP)
   - Role-based access (RBAC):
     - **View-Only:** Risk & underwriting teams
     - **Edit:** Actuarial & reinsurance teams
     - **Admin:** System administrator
   - Audit logging (who accessed what, when)

4. **Automated Refresh Pipeline**
   - Monthly CSV upload → auto-run ETL
   - Trigger Phase 0 notebook on schedule
   - Re-generate dashboard + hotspots
   - Email alerts if concentration thresholds exceeded

5. **Documentation & Training**
   - API documentation (Swagger/OpenAPI)
   - User guide (dashboard navigation)
   - Data update runbook
   - Training session for risk team (2 hours)

### Deliverables (Phase IV)

- Dockerfile + docker-compose.yml
- API documentation (Swagger)
- User manual (PDF)
- Deployment guide (internal/cloud-specific)
- Training presentation (PowerPoint)
- Runbook for monthly updates
- System architecture diagram

### Deployment Checklist

- [ ] Docker images built + tested
- [ ] Database initialized (PostgreSQL if used)
- [ ] Backend API running on production server
- [ ] Frontend dashboard accessible via HTTPS
- [ ] User authentication working (test accounts)
- [ ] Backup + disaster recovery tested
- [ ] Monitoring alerts configured
- [ ] Documentation complete
- [ ] Team trained + signed off

### Phase IV Timeline

- **Week 13:** Docker setup + deployment infrastructure
- **Week 14:** User auth + RBAC implementation
- **Week 15:** Automated refresh pipeline, testing
- **Week 16:** Training, documentation, go-live

---

## 🎯 Success Criteria (Project-Wide)

### Functional Requirements

- [x] ✅ Phase 0: 100% of policies mapped to RPA zones
- [ ] Phase I: Interactive GIS map + PML scenarios
- [ ] Phase II: REST API + Streamlit dashboard
- [ ] Phase III: 3 livrables delivered (map, dashboard, strategic note)
- [ ] Phase IV: Production-ready system with automated refresh

### Quality Requirements

- [ ] Data quality score ≥ 94%
- [ ] API uptime ≥ 99.5%
- [ ] Dashboard load time < 3 seconds
- [ ] All concentrations verified by domain expert

### Business Requirements

- [ ] Alignment with CDC (Cahier des Charges) 100%
- [ ] RPA 99/Version 2003 compliance verified
- [ ] Recommendations actionable (accepted by executives)
- [ ] System usable by non-technical stakeholders (risk team)

### Delivery Requirements

- [ ] All outputs delivered on schedule (12–16 weeks)
- [ ] Team documentation complete
- [ ] Training session conducted
- [ ] System handed over to operations team

---

## 📊 Resource & Cost Estimates

### Team Composition

| Role               | Count  | Weeks | Cost       | Notes                       |
| ------------------ | ------ | ----- | ---------- | --------------------------- |
| Data Scientists    | 2–3    | 16    | ~$80K      | Cleaning, analysis, PML     |
| Software Engineers | 3–4    | 16    | ~$120K     | Backend, frontend, DevOps   |
| GIS Specialist     | 1 (PT) | 8     | ~$15K      | Mapping, vectorization      |
| Domain Expert      | 1 (PT) | 8     | ~$20K      | Validation, recommendations |
| Project Lead       | 1      | 16    | ~$40K      | Coordination, sign-offs     |
| **TOTAL**          | 8–10   | -     | **~$275K** | Typical engagement cost     |

### Infrastructure (16 weeks)

- Cloud hosting (AWS/Azure): ~$2–5K
- Mapping services (Mapbox tiles): ~$1–2K
- Database (PostgreSQL SaaS): ~$500–1K
- Monitoring/logging: ~$500–1K
- **TOTAL:** ~$5–10K

---

## 📞 Risk Management

| Risk                       | Impact | Mitigation                            | Owner    |
| -------------------------- | ------ | ------------------------------------- | -------- |
| Incomplete RPA mapping     | HIGH   | Digitize Annexe 1 in Phase 0 ✅       | DS Lead  |
| Data gaps (building-level) | MEDIUM | Document + recommend enrichment       | DS Lead  |
| Performance (large GIS)    | MEDIUM | Use PostGIS indexes + aggregations    | Eng Lead |
| Domain expert unavailable  | HIGH   | Schedule early + frequent touchpoints | PM       |
| Scope creep (PML advanced) | MEDIUM | Defer probabilistic to Phase II+      | PM       |
| Deployment delays          | MEDIUM | CI/CD pipeline ready from Phase I     | Eng Lead |

---

## 📚 Key References

- **RPA 99/Version 2003:** Algerian seismic code (Chapter IX: confined masonry)
- **CDC (Cahier des Charges):** [Cahier de charge.pdf]
- **Dataset:** CATNAT_2023_2025.csv (39,196 policies)
- **EDA Report:** [EDA_FINAL_REPORT.md]
- **Data Dictionary:** [DATA_DICTIONARY.md]

---

## 🚀 Next Immediate Actions

**This Week (Week 1–2, Phase 0):**

- [x] Share roadmap with team
- [x] DS team: Clean dataset + create RPA lookup ✅
- [x] Eng team: Setup repo + ETL skeleton ✅
- [x] Schedule Phase I kickoff

**Next Week (Week 3, Phase I Starts):**

- [ ] DS: Begin PML scenario development
- [ ] GIS: Obtain wilaya/commune boundaries + RPA zones
- [ ] Eng: Build FastAPI Phase I endpoints
- [ ] PM: Weekly sync + milestone review

---

**Status:** ✅ PHASE 0 COMPLETE | 🚀 PHASE I READY TO COMMENCE

**Last Updated:** April 17, 2026  
**Next Review:** April 24, 2026 (Phase I 1-week check-in)
