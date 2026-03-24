from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict
from datetime import date
from enum import Enum


class RiskProfile(str, Enum):
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"


class AssetClass(str, Enum):
    EQUITY = "equity"
    DEBT = "debt"
    HYBRID = "hybrid"
    GOLD = "gold"
    LIQUID = "liquid"


class InvestmentHolding(BaseModel):
    scheme_name: str
    units: float
    current_value: float
    invested_amount: float
    asset_class: AssetClass
    purchase_date: date


class UserFinancialProfile(BaseModel):
    age: int = Field(ge=18, le=100)
    monthly_income: float = Field(gt=0)
    monthly_expenses: float = Field(ge=0)
    total_savings: float = Field(ge=0)
    total_debt: float = Field(ge=0)
    emergency_fund: float = Field(ge=0)
    life_insurance_cover: float = Field(ge=0)
    health_insurance_cover: float = Field(ge=0)
    dependents: int = Field(ge=0)
    risk_profile: RiskProfile
    has_home: bool = False
    annual_income: Optional[float] = None

    @validator('annual_income', always=True)
    def calculate_annual_income(cls, v, values):
        if v is None and 'monthly_income' in values:
            return values['monthly_income'] * 12
        return v


class PortfolioAnalysisRequest(BaseModel):
    user_profile: UserFinancialProfile
    holdings: List[InvestmentHolding]


class HealthScoreDimension(BaseModel):
    dimension: str
    score: float = Field(ge=0, le=100)
    status: str
    recommendations: List[str]


class MoneyHealthScore(BaseModel):
    overall_score: float
    grade: str
    dimensions: List[HealthScoreDimension]


class PortfolioMetrics(BaseModel):
    total_invested: float
    current_value: float
    absolute_returns: float
    returns_percentage: float
    xirr: Optional[float]
    asset_allocation: Dict[str, float]
    diversification_score: float
    equity_exposure: float
    debt_exposure: float


class AIRecommendation(BaseModel):
    category: str
    priority: str
    title: str
    description: str
    potential_impact: str


class ComprehensiveAnalysis(BaseModel):
    health_score: MoneyHealthScore
    portfolio_metrics: PortfolioMetrics
    ai_recommendations: List[AIRecommendation]
    risk_assessment: str
    tax_saving_opportunities: List[str]
