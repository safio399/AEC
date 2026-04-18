# 🎨 POWERFUL DASHBOARD GENERATION PROMPT

## For GAM Assurances - CATNAT Seismic Risk Intelligence Platform

---

## 📋 MASTER PROMPT FOR PERFECT DASHBOARD GENERATION

**Use this prompt with your preferred tool (Claude, ChatGPT, etc.) to generate an enterprise-grade dashboard:**

```
You are designing an executive-level insurance risk analytics dashboard for GAM Assurances,
a leading Algerian insurance company specializing in catastrophe insurance (CATNAT).

BRAND IDENTITY:
- Company: GAM Assurances
- Brand Colors: Dark Forest Green (#1B6D3A), Lime Green (#C5D921), White (#FFFFFF)
- Logo: Use GAM Assurances branding prominently in header
- Style: Professional, modern, financial-grade UI/UX
- Industry: Insurance & Reinsurance Risk Management
- Audience: C-Level executives, Risk managers, Portfolio managers

PROJECT SCOPE:
- Portfolio: 39,196 policies across 51 Algerian wilayas
- Total Capital at Risk: 43,431.81 Million DZD (Algerian Dinar)
- Zones: 4 seismic zones (Zone 0-III) with Zone III concentration CRITICAL (6.64%)
- Primary Risk: Seismic events (earthquakes) and catastrophe insurance (CATNAT)
- PML Scenarios: 1-in-50 (14.93 Md DZD), 1-in-250 (523.02 Md DZD), 1-in-500 (626.76 Md DZD)

DASHBOARD SECTIONS REQUIRED:

1. EXECUTIVE SUMMARY BANNER
   - GAM Assurances logo + company name (top left)
   - Key metrics: Total Policies, Total Capital, Active Zones, Risk Level
   - Real-time indicators: Portfolio health, Solvency Ratio (2.37%), Zone III Alert
   - Date/time last updated

2. SEISMIC RISK HEATMAP
   - Interactive map of 51 wilayas color-coded by seismic zone
   - Dark Green for Zone 0 (low risk), gradient to Lime Green for Zone III (critical)
   - Hover tooltips: Wilaya name, zone, policies count, capital exposure, vulnerability score
   - Top 20 hotspots highlighted in bright red with concentration percentage
   - Include GIS commune-level detail (100+ communes with policy density)

3. PORTFOLIO CAPITAL DISTRIBUTION
   - Multi-view visualization:
     a) Pie chart: Capital by Seismic Zone (dark green for Zone 0, lime for III)
     b) Treemap: Capital by Coverage Type × Zone (hierarchical)
     c) Bar chart: Top 15 wilayas by capital exposure
   - All values in Md DZD (Million Dinar Algerian)
   - Show concentration risk metrics (Herfindahl Index, Gini Coefficient)

4. PROBABILITY OF MAXIMUM LOSS (PML) SCENARIOS
   - Three earthquake scenario cards:
     - 1-in-50 year event: 14.93 Md DZD loss
     - 1-in-250 year event: 523.02 Md DZD loss (CRITICAL)
     - 1-in-500 year event: 626.76 Md DZD loss
   - Visual severity indicators (risk gauge, color progression)
   - Estimated affected policies and affected wilayas for each scenario

5. STRESS TESTING & SCENARIO ANALYSIS
   - 5-scenario comparison dashboard:
     - Capital reduction scenarios: -10%, -15%, -20%, -25%, -30%
     - Show Zone III percentage for each scenario
     - Highlight "Target Met" scenarios (Zone III < 10%)
     - Recommend optimal reduction strategy (-25% = 6.64% → 3.75%)

6. REINSURANCE STRATEGY COMPARISON
   - Strategy A vs Strategy B side-by-side comparison:
     - Strategy A (Simplifié - 3-Layer):
       - Annual Cost: 2,350 Md DZD
       - Coverage: 80%
       - Implementation: 2 months
       - Net Loss: 103.06 Md DZD
       - ROI: 4.4:1 (RECOMMENDED ⭐)
     - Strategy B (Avancé - 4-Layer + Parametric):
       - Annual Cost: 4,200 Md DZD
       - Coverage: 92%
       - Implementation: 4 months
       - Net Loss: 78.45 Md DZD
       - ROI: 2.5:1 (Future roadmap)
   - Cost-benefit analysis graph
   - 12-month hybrid implementation roadmap

7. ML PREDICTIVE RISK SCORING
   - CatBoost risk model predictions by wilaya
   - Risk score distribution histogram (0-100 scale)
   - Top 10 highest-risk wilayas table with:
     - Wilaya name, Risk Score, Policies, Capital, Avg Premium
     - Predicted loss probability, Recommended premium adjustment
   - Feature importance chart showing which factors drive risk most

8. STRATEGIC RECOMMENDATIONS PANEL
   - 4 Strategic Recommendations display:
     REC_001: Zone III Concentration Mitigation (CRITICAL Priority)
     REC_002: Zone 0/I Expansion Opportunity (HIGH Priority)
     REC_003: Underwriting Policy Framework (CRITICAL Priority)
     REC_004: Reinsurance Strategy Optimization (HIGH Priority)
   - For each: Description, Expected Impact, Timeline, Owner/Responsible team

9. FINANCIAL METRICS & SOLVENCY
   - Portfolio metrics dashboard:
     - Average Capital per Policy: Md DZD
     - Total Premium Income: Md DZD
     - Expected Annual Loss: Md DZD
     - Solvency Ratio: 2.37%
     - Available Capital Reserve: Md DZD
   - Monthly trend lines (projected 12-month forecast)
   - Risk-adjusted return calculations

10. INTERACTIVE FILTERS & DRILL-DOWN
    - Sidebar filters: Wilaya, Zone, Coverage Type, Risk Level
    - Date range picker (monthly reporting)
    - Export functionality: PDF, CSV, JSON
    - Drill-down capability from summary → detailed records

DESIGN REQUIREMENTS:

COLOR PALETTE:
- Primary: Dark Forest Green (#1B6D3A) - Trust, stability, nature/environmental
- Secondary: Lime Green (#C5D921) - Energy, alert, emergency signals
- Neutral: White (#FFFFFF), Light Gray (#F5F5F5)
- Alerts: Red (#DC3545) for critical risks, Orange (#FFC107) for warnings
- Accent: Gold (#D4AF37) for highlights, Dark Gray (#333333) for text
- Gradient: Dark Green → Lime Green for seismic zone risk levels

TYPOGRAPHY:
- Headers: Bold sans-serif (Montserrat, Poppins, or Inter)
- Body: Clean sans-serif (Roboto, Open Sans)
- Numbers: Monospace for precision (OCR-A, IBM Plex Mono)

LAYOUT:
- 12-column responsive grid
- Dark mode recommended for financial dashboards (Dark background #1A1A1A, light text)
- Alternatively: Light theme with dark green accents
- Mobile-responsive (mobile, tablet, desktop)
- Sidebar navigation collapsible

INTERACTIVE FEATURES:
- Hover tooltips with detailed information
- Click-through drill-down capabilities
- Real-time data refresh (every 5 minutes)
- Multi-select filters
- Export buttons (PDF, CSV, JSON)
- Dark/Light mode toggle
- Full-screen visualization options

DATA SOURCES:
- Portfolio data: 39,196 policies with 16 attributes
- PML scenarios: 3 earthquake models (M7.0, M7.5, M6.5)
- Stress tests: 5 capital reduction scenarios
- GIS data: 100+ communes with geospatial heatmap
- ML predictions: CatBoost model risk scores

TECHNICAL SPECIFICATIONS:
- Platform: Streamlit (Python) or Next.js + React (JavaScript)
- Maps: Leaflet + Mapbox GL or Plotly Geo
- Charts: Plotly, Recharts, or D3.js
- Backend: FastAPI (port 8000) with 14+ endpoints
- Currency: All financial figures in Md DZD (Million Dinar Algerian)
- Real-time: WebSocket support for live data updates

PERFORMANCE REQUIREMENTS:
- Page load time: < 3 seconds
- Chart rendering: < 500ms
- Filter response: < 200ms
- Data refresh: Every 5 minutes (configurable)
- Support 50,000+ records efficiently

ACCESSIBILITY:
- WCAG 2.1 AA compliance
- Colorblind-friendly palette
- Keyboard navigation
- Screen reader support
- Multilingual: French, Arabic (RTL), English

OUTPUT DELIVERABLES:
1. Interactive dashboard (production-ready)
2. Component library (reusable widgets)
3. Color palette & design tokens file
4. Responsive CSS/Tailwind configuration
5. API integration documentation
6. Deployment guide (Docker, etc.)
7. User guide & feature documentation
8. Performance optimization report

TONE & MESSAGING:
- Professional, trustworthy, data-driven
- Emphasize risk mitigation and strategic value
- Executive-friendly: clear insights without technical jargon
- Confidence-building: show GAM's control over portfolio risk
- Action-oriented: highlight strategic recommendations
- Arabic/French bilingual support where applicable

SUCCESS CRITERIA:
✓ Visualizes 39,196 policies without performance degradation
✓ Clearly communicates Zone III critical concentration problem
✓ Makes reinsurance strategy comparison obvious and compelling
✓ Provides actionable insights for portfolio managers
✓ Matches GAM Assurances brand identity perfectly
✓ Enables data-driven decision-making at executive level
✓ Supports monthly/quarterly/annual reporting cycles
✓ Integrates seamlessly with FastAPI backend
✓ Handles real-time data updates gracefully
✓ Mobile and desktop responsive design
```

---

## 🎯 HOW TO USE THIS PROMPT

### Option 1: Generate with AI (Claude, ChatGPT, etc.)

1. Copy the master prompt above
2. Paste into your preferred AI tool
3. Add: "Generate [format of choice]:
   - Streamlit app code (Python)
   - React component code (JavaScript/TypeScript)
   - Figma design specs
   - HTML/CSS/JS prototype
   - Design system documentation"

### Option 2: Generate with No-Code Tools

- **Figma**: Use as design brief, import with AI plugin
- **Bubble.io**: Use as requirements spec
- **Retool**: Use as dashboard template guide
- **Metabase**: Use for configuration requirements

### Option 3: Customize for Your Team

Replace sections with specific priorities:

- More emphasis on ML features
- Add real-time alerts/notifications
- Include reporting automation
- Add user role-based access control (RBAC)
- Include audit logging

---

## 📊 SAMPLE DASHBOARD SECTIONS ARCHITECTURE

```
Dashboard
├── Header
│   ├── GAM Logo + Title
│   ├── Key Metrics (4 cards)
│   └── Last Updated + Refresh Button
├── Navigation Sidebar
│   ├── Dashboard (Overview)
│   ├── Risk Analysis
│   ├── Scenarios & Stress Tests
│   ├── Reinsurance Strategy
│   ├── Financial Metrics
│   └── Reports & Export
├── Main Content Area
│   ├── Heatmap Visualization
│   ├── Capital Distribution Charts
│   ├── PML Scenario Cards
│   ├── Stress Test Matrix
│   ├── Recommendation Panels
│   └── Details Table
└── Filter Panel (Right Sidebar)
    ├── Wilaya Filter
    ├── Zone Filter
    ├── Risk Level Filter
    └── Date Range Picker
```

---

## 💚 BRAND COLOR USAGE GUIDE

| Component           | Color        | Hex     | Usage            |
| ------------------- | ------------ | ------- | ---------------- |
| Logo & Header       | Dark Green   | #1B6D3A | Primary branding |
| Highlights & Alerts | Lime Green   | #C5D921 | Emphasis, CTAs   |
| Zone 0 (Low Risk)   | Dark Green   | #1B6D3A | Safe, secure     |
| Zone I (Medium)     | Medium Green | #4CAF50 | Acceptable       |
| Zone II (Higher)    | Light Lime   | #9CCC65 | Warning          |
| Zone III (Critical) | Bright Lime  | #C5D921 | ALERT            |
| Critical Risk       | Red          | #DC3545 | Immediate action |
| Warning             | Orange       | #FFC107 | Attention needed |
| Success             | Green        | #28A745 | Good status      |
| Neutral             | Gray         | #6C757D | Information      |

---

## 🚀 NEXT STEPS

1. **Choose your platform:**
   - Streamlit (fastest, Python-based) ← Recommended for your project
   - React (most flexible, JavaScript)
   - Plotly Dash (Python, interactive)
   - Superset (BI-focused, open-source)

2. **Run the prompt:**
   - Ask AI to generate the codebase
   - Or hire a dashboard developer with this spec

3. **Integrate with your backend:**
   - Connect to FastAPI endpoints (port 8000)
   - Use `/api/portfolio/summary`, `/api/pml/scenarios`, etc.

4. **Deploy:**
   - Docker container (provided in your project)
   - Cloud platform (AWS, Azure, Heroku)
   - Local server for testing

---

## 📞 QUESTIONS TO REFINE FURTHER

- Preferred tech stack (Streamlit vs React)?
- Real-time updates needed?
- Multi-user access control required?
- Arabic/French bilingual support?
- Mobile app needed (separate from web)?
- Custom report generation?
- Integration with other systems?

---

**Generated:** April 17, 2026  
**For:** GAM Assurances CATNAT Risk Platform  
**Status:** Ready for Dashboard Generation ✅
