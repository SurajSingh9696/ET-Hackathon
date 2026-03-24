from app.models.schemas import (
    PortfolioAnalysisRequest,
    ComprehensiveAnalysis,
)
from app.services.health_score_calculator import HealthScoreCalculator
from app.services.portfolio_analyzer import PortfolioAnalyzer
from app.services.ai_recommendation_engine import AIRecommendationEngine


class FinancialAnalysisService:

    def __init__(self):
        self.health_calculator = HealthScoreCalculator()
        self.portfolio_analyzer = PortfolioAnalyzer()
        self.ai_engine = AIRecommendationEngine()

    def perform_comprehensive_analysis(
        self, request: PortfolioAnalysisRequest
    ) -> ComprehensiveAnalysis:
        health_score = self.health_calculator.calculate_comprehensive_score(
            request.user_profile
        )

        portfolio_metrics = self.portfolio_analyzer.analyze_portfolio(
            request.holdings
        )

        ai_recommendations = self.ai_engine.generate_recommendations(
            request.user_profile,
            health_score,
            portfolio_metrics
        )

        risk_assessment = self.ai_engine.generate_risk_assessment(
            request.user_profile,
            portfolio_metrics
        )

        tax_opportunities = self.ai_engine.identify_tax_opportunities(
            request.user_profile
        )

        return ComprehensiveAnalysis(
            health_score=health_score,
            portfolio_metrics=portfolio_metrics,
            ai_recommendations=ai_recommendations,
            risk_assessment=risk_assessment,
            tax_saving_opportunities=tax_opportunities
        )
