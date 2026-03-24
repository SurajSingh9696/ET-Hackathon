# AI Money Mentor - System Architecture

## Overview
AI Money Mentor is an intelligent financial health analysis platform that combines rule-based financial calculations with AI-powered personalized recommendations.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   React SPA (Vite + Tailwind CSS)                        │  │
│  │   - User Profile Form                                     │  │
│  │   - Portfolio Input Interface                             │  │
│  │   - Results Dashboard with Visualizations                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JSON)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                          API Layer                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   FastAPI Backend                                         │  │
│  │   - /api/v1/analyze (POST)                                │  │
│  │   - Request validation via Pydantic                       │  │
│  │   - CORS middleware for cross-origin requests             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │   Financial Analysis Service (Orchestrator)              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│       ┌──────────────────────┼──────────────────────┐           │
│       │                      │                      │           │
│  ┌────▼────┐          ┌─────▼─────┐         ┌─────▼─────┐     │
│  │  Health │          │ Portfolio │         │    AI     │     │
│  │  Score  │          │ Analyzer  │         │ Recomm.   │     │
│  │  Engine │          │           │         │  Engine   │     │
│  └─────────┘          └───────────┘         └───────────┘     │
│       │                      │                      │           │
│       │                      │                      │           │
│  ┌────▼─────────────────────▼──────────────────────▼─────┐    │
│  │            Core Financial Algorithms                   │    │
│  │  - 6-Dimension Health Scoring                          │    │
│  │  - XIRR Calculation (Newton-Raphson)                   │    │
│  │  - Asset Allocation Analysis                           │    │
│  │  - Diversification Metrics (HHI)                       │    │
│  │  - Tax Optimization Rules                              │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (Optional)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      External AI Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │   LLM APIs (OpenAI GPT-4 / Anthropic Claude)             │  │
│  │   - Contextual financial recommendations                  │  │
│  │   - Personalized insights based on user profile           │  │
│  │   - Fallback to rule-based if API unavailable             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Health Score Calculator
**Purpose**: Calculates comprehensive financial wellness across 6 dimensions

**Dimensions Analyzed**:
1. **Savings Discipline** (0-100)
   - Evaluates savings rate (Monthly Savings / Monthly Income)
   - Benchmark: 20-30% is healthy

2. **Debt Management** (0-100)
   - Analyzes debt-to-income ratio
   - Critical threshold: 40% of annual income

3. **Emergency Fund** (0-100)
   - Measures liquidity coverage
   - Target: 6 months of expenses

4. **Investment Discipline** (0-100)
   - Investment rate vs income
   - Asset growth trajectory

5. **Insurance Protection** (0-100)
   - Life insurance: 10x annual income
   - Health insurance: ₹5L + ₹5L per dependent

6. **Tax Efficiency** (0-100)
   - Utilization of Section 80C/80D deductions
   - Optimization opportunities

**Scoring Algorithm**:
```
Overall Score = Average(All 6 Dimension Scores)
Grade Mapping:
  A+ : 85-100
  A  : 75-84
  B+ : 65-74
  B  : 55-64
  C  : 45-54
  D  : 0-44
```

### 2. Portfolio Analyzer
**Purpose**: Deep analysis of investment portfolio performance

**Key Metrics**:

1. **XIRR (Extended Internal Rate of Return)**
   - Annualized return considering irregular cash flows
   - Algorithm: Newton-Raphson iterative method
   - Formula: NPV = Σ(CF_i / (1 + r)^(days_i/365.25)) = 0

2. **Asset Allocation**
   - Breakdown by asset class (Equity, Debt, Hybrid, Gold, Liquid)
   - Percentage distribution
   - Comparison vs recommended allocation for risk profile

3. **Diversification Score (0-100)**
   - Components:
     * Number of holdings (40 points)
     * Number of asset classes (30 points)
     * Concentration risk via HHI (30 points)
   - HHI (Herfindahl-Hirschman Index) = Σ(percentage_i²)

4. **Risk-Return Profile**
   - Volatility vs returns
   - Sharpe ratio estimation

### 3. AI Recommendation Engine
**Purpose**: Generate personalized, actionable financial advice

**Dual-Mode Operation**:

**Mode 1: AI-Powered (When API Key Available)**
- Uses GPT-4 or Claude for contextual analysis
- Provides nuanced recommendations based on:
  * User's life stage and goals
  * Market conditions
  * Behavioral finance principles
- Output: 5 prioritized recommendations with quantified impact

**Mode 2: Rule-Based Fallback**
- 20+ financial rules encoded
- Priority-based recommendation selection
- Examples:
  * Emergency fund < 3 months → HIGH priority
  * Debt-to-income > 40% → HIGH priority
  * Tax savings opportunity → MEDIUM priority

**Recommendation Structure**:
```json
{
  "category": "emergency_fund|debt|investment|tax|insurance|diversification",
  "priority": "high|medium|low",
  "title": "Short actionable title",
  "description": "Specific steps with amounts and timeline",
  "potential_impact": "Quantified benefit"
}
```

## Data Flow

### Request Flow
1. **User Input** → Frontend forms collect profile + portfolio
2. **Validation** → Pydantic models validate data types and ranges
3. **Analysis** → Parallel execution of 3 analyzers:
   - Health Score Calculator (synchronous)
   - Portfolio Analyzer (synchronous)
   - AI Recommendation Engine (may call external API)
4. **Response** → Comprehensive analysis JSON returned
5. **Visualization** → React components render interactive dashboard

### Analysis Process
```
┌─────────────────┐
│  User Profile   │
│  + Portfolio    │
└────────┬────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  Financial Analysis Service            │
│  (Orchestrates all analyzers)          │
└────────┬───────────────────────────────┘
         │
    ┌────┴────┬────────────┬──────────┐
    │         │            │          │
    ▼         ▼            ▼          ▼
┌───────┐ ┌────────┐ ┌─────────┐ ┌────────┐
│Health │ │Portfolio│ │   AI    │ │  Tax   │
│Score  │ │Metrics │ │ Recomm. │ │Analyze │
└───┬───┘ └────┬───┘ └────┬────┘ └───┬────┘
    │          │           │          │
    └──────────┴───────────┴──────────┘
                    │
                    ▼
         ┌──────────────────┐
         │ Comprehensive    │
         │ Analysis Result  │
         └──────────────────┘
```

## Technology Stack

### Backend
- **Framework**: FastAPI 0.115+
- **Language**: Python 3.11+
- **Validation**: Pydantic v2
- **Numerical**: NumPy 1.26+
- **AI APIs**: OpenAI / Anthropic (optional)
- **Server**: Uvicorn with async support

### Frontend
- **Framework**: React 18.3+
- **Build Tool**: Vite 5.4+
- **Styling**: Tailwind CSS 3.4+
- **Charts**: Recharts 2.12+
- **Icons**: Lucide React
- **HTTP**: Axios

### Architecture Patterns
- **Separation of Concerns**: Clear layering (API, Business Logic, Data)
- **Dependency Injection**: Services passed to orchestrator
- **Strategy Pattern**: AI vs Rule-based recommendations
- **Builder Pattern**: Complex analysis result construction

## API Specification

### POST /api/v1/analyze

**Request Body**:
```json
{
  "user_profile": {
    "age": 30,
    "monthly_income": 100000,
    "monthly_expenses": 60000,
    "total_savings": 500000,
    "total_debt": 200000,
    "emergency_fund": 200000,
    "life_insurance_cover": 5000000,
    "health_insurance_cover": 500000,
    "dependents": 2,
    "risk_profile": "moderate",
    "has_home": false
  },
  "holdings": [
    {
      "scheme_name": "HDFC Equity Fund",
      "units": 100,
      "current_value": 150000,
      "invested_amount": 100000,
      "asset_class": "equity",
      "purchase_date": "2023-01-15"
    }
  ]
}
```

**Response**:
```json
{
  "health_score": {
    "overall_score": 72.5,
    "grade": "B+",
    "dimensions": [...]
  },
  "portfolio_metrics": {
    "total_invested": 100000,
    "current_value": 150000,
    "absolute_returns": 50000,
    "returns_percentage": 50,
    "xirr": 45.2,
    "asset_allocation": {...},
    "diversification_score": 45
  },
  "ai_recommendations": [...],
  "risk_assessment": "...",
  "tax_saving_opportunities": [...]
}
```

## Performance Characteristics

- **Analysis Time**: < 2 seconds (without AI), < 5 seconds (with AI)
- **Concurrency**: Async FastAPI handles 1000+ req/sec
- **Accuracy**: XIRR within 0.01% of Excel calculation
- **Scalability**: Stateless design, horizontally scalable

## Security Considerations

1. **Input Validation**: All inputs validated via Pydantic
2. **No Data Storage**: Completely stateless, no PII stored
3. **API Key Security**: Environment variables only
4. **CORS**: Configurable origins
5. **Rate Limiting**: Can be added via middleware

## Deployment Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Netlify   │      │   Railway    │      │  OpenAI /   │
│  (Frontend) │─────▶│  (Backend)   │─────▶│  Anthropic  │
│   CDN       │      │   FastAPI    │      │   (AI API)  │
└─────────────┘      └──────────────┘      └─────────────┘
```

## Future Enhancements

1. **Data Persistence**: Store analysis history
2. **Goal Planning**: SIP calculator, retirement planning
3. **Market Integration**: Live NAV updates, BSE/NSE data
4. **Multi-Language**: Regional language support
5. **Mobile App**: React Native version
6. **Social Features**: Compare with peer benchmarks
7. **Alerts**: Rebalancing notifications, market insights

## Innovation Highlights

1. **Hybrid Intelligence**: Combines deterministic algorithms + AI creativity
2. **Real XIRR**: Accurate calculation, not approximations
3. **Holistic Approach**: 6 dimensions vs single metric
4. **Actionable Insights**: Not just scores, but specific next steps
5. **Instant Analysis**: No signup, no waiting
6. **Indian Compliance**: 80C, 80D, tax rules built-in
