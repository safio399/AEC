# CATNAT Intelligence Platform

A comprehensive seismic risk assessment and portfolio management platform for Algerian natural catastrophe insurance.

[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com)

---

## Overview

The **CATNAT Intelligence Platform** is an end-to-end solution for assessing seismic risk exposure across Algerian insurance portfolios. It combines machine learning risk prediction, RPA 99/2003 regulatory compliance, and interactive dashboards to provide actionable insights for risk management and strategic decision-making.

### Key Capabilities

- **Seismic Risk Analysis** — RPA 99/Version 2003 zone-based vulnerability scoring
- **ML-Powered Predictions** — CatBoost models for risk assessment
- **Portfolio Analytics** — 39,196 policies across 51 wilayas, 789 communes
- **Interactive Dashboard** — Bilingual (FR/EN) responsive web interface
- **Strategic Recommendations** — Automated hotspot identification and mitigation strategies
- **Real-time API** — FastAPI backend with CORS support

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### 1. Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```

API will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
cd Interface/project
npm install
npm run dev
```

Dashboard will be available at `http://localhost:8080`

---

## Project Structure

```
.
├── backend/                    # FastAPI REST API
│   ├── app.py                 # Main API application
│   ├── requirements.txt       # Python dependencies
│   └── Procfile              # Heroku deployment config
│
├── Interface/project/         # React + TypeScript Dashboard
│   ├── src/                  # Source code
│   ├── package.json          # Node dependencies
│   ├── vite.config.ts       # Vite build config
│   └── tailwind.config.js   # Tailwind styling
│
├── data/                      # Datasets & models
│   ├── CATNAT_2023_2025.csv              # Raw policy data (39,196 records)
│   ├── portfolio_enriched.parquet        # Cleaned & enriched dataset
│   ├── rpa_zoning.csv                    # RPA 99 seismic zones
│   ├── hotspots_identified.csv          # Risk concentration analysis
│   ├── models/                           # ML models (CatBoost)
│   └── *.png, *.geojson                 # Visualizations & GIS data
│
├── notebooks/                 # Jupyter analysis notebooks
├── docs/                      # Documentation & roadmaps
├── markdown/                  # Delivery reports & summaries
├── reports/                   # Generated analysis reports
└── README.md                  # This file
```

---

## Technology Stack

### Backend
- **FastAPI** — High-performance async web framework
- **CatBoost** — Gradient boosting for risk prediction
- **Pandas/NumPy** — Data manipulation & analysis
- **Uvicorn** — ASGI server

### Frontend
- **React 18** — Component-based UI library
- **TypeScript** — Type-safe JavaScript
- **Vite** — Fast build tool
- **TailwindCSS** — Utility-first styling
- **Recharts** — Data visualization
- **Deck.gl** — WebGL-powered mapping
- **MapLibre GL** — Open-source mapping library
- **Lucide React** — Icon library

### Data & ML
- **Parquet** — Columnar storage format
- **GeoJSON** — Geographic data interchange
- **CatBoost** — Gradient boosting framework

---

## Features

### Dashboard
- **Bilingual Support** — French/English language switching
- **Responsive Design** — Mobile, tablet, and desktop optimized
- **Dark/Light Theme** — GAM-branded dark green theme
- **Real-time Data** — Live API integration

### Risk Analysis
- **Seismic Zoning** — RPA 99/2003 compliance (Zones 0, I, IIa, IIb, III)
- **Vulnerability Scoring** — 0-1 scale based on building type & location
- **Hotspot Detection** — Top 20 concentration areas identified
- **PML Scenarios** — Probable Maximum Loss calculations
- **Stress Testing** — Multi-scenario impact analysis

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/portfolio/summary` | Portfolio overview metrics |
| `GET /api/portfolio/by-zone` | Capital distribution by seismic zone |
| `GET /api/risk/hotspots` | High-concentration communes |
| `GET /api/ml/predict` | ML risk predictions |
| `GET /api/pml/scenarios` | PML scenario analysis |
| `GET /api/health` | API health check |

---

## Data Overview

### Portfolio Metrics

| Metric | Value |
|--------|-------|
| Total Policies | 39,196 |
| Total Capital | $299.5B USD |
| Geographic Coverage | 51 wilayas, 789 communes |
| Data Quality Score | 94.4% |
| RPA Coverage | 100% |

### Seismic Zone Distribution

| Zone | Risk Level | Capital % |
|------|------------|-----------|
| Zone 0 | Very Low | 9.3% |
| Zone I | Low | 57.4% |
| Zone IIa | Medium-High | 18.8% |
| Zone IIb | High | 6.6% |
| Zone III | Very High | 6.6% |

---

## Documentation

- **[docs/README.md](docs/README.md)** — Phase 0 completion report
- **[docs/DATA_DICTIONARY.md](docs/DATA_DICTIONARY.md)** — Column definitions & schemas
- **[docs/PHASE_ROADMAP.md](docs/PHASE_ROADMAP.md)** — 12-16 week execution plan
- **[Interface/START_HERE.md](Interface/START_HERE.md)** — Dashboard quick start
- **[Interface/MERGED_DASHBOARD_GUIDE.md](Interface/MERGED_DASHBOARD_GUIDE.md)** — Full dashboard documentation

---

## Regulatory Compliance

This platform implements **RPA 99/Version 2003** (Règlement Parasismique Algérien), the Algerian seismic building code:

- **Chapter IX** — Confined masonry construction rules
- **Annexe 1** — Seismic zone classification for 51 wilayas
- **Zone Multipliers** — Zone 0 (0.8x) to Zone III (1.5x)

---

## Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd Interface/project
npm run lint
npm run typecheck
```

### Building for Production

```bash
# Frontend production build
cd Interface/project
npm run build

# Backend deployment ready
# See backend/Procfile for Heroku config
```

---

## Deployment Options

### Option 1: Vercel (Frontend)
```bash
cd Interface/project
npm install -g vercel
vercel
```

### Option 2: Heroku (Backend)
```bash
cd backend
git push heroku main
```

### Option 3: Docker
```bash
docker build -t catnat-platform .
docker run -p 8080:8080 -p 8000:8000 catnat-platform
```

---

## Strategic Recommendations

The platform has identified **critical concentration in Zone III** (6.6% of capital). Key recommendations:

1. **Mitigation** — Suspend new subscriptions in top 5 Zone III communes
2. **Pricing** — 15-25% premium loading for high-risk zones
3. **Reinsurance** — Additional catastrophe excess layer coverage
4. **Growth Opportunity** — Expand in Zones 0/I (Saharan regions)

See **[data/strategic_note.md](data/strategic_note.md)** for full details.

---

## License

Internal use only — GAM Risk & Actuarial Team

---

## Contact

**Project Status:** ✅ Production Ready  
**Last Updated:** April 18, 2026  
**Repository:** `c:\Users\WINDOWS\OneDrive\Desktop\Sys`

---

*Generated for CATNAT Seismic Resilience Platform v2.0.0*
