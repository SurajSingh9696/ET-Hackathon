import os
import json
from typing import List
from app.models.schemas import (
    UserFinancialProfile,
    MoneyHealthScore,
    PortfolioMetrics,
    AIRecommendation
)


class AIRecommendationEngine:

    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY") or os.getenv("ANTHROPIC_API_KEY")
        self.provider = "openai" if os.getenv("OPENAI_API_KEY") else "anthropic"

    def generate_recommendations(
        self,
        profile: UserFinancialProfile,
        health_score: MoneyHealthScore,
        portfolio_metrics: PortfolioMetrics
    ) -> List[AIRecommendation]:
        prompt = self._build_analysis_prompt(profile, health_score, portfolio_metrics)

        if self.api_key:
            try:
                return self._call_ai_api(prompt)
            except Exception as e:
                print(f"AI API error: {e}")
                return self._generate_rule_based_recommendations(
                    profile, health_score, portfolio_metrics
                )
        else:
            return self._generate_rule_based_recommendations(
                profile, health_score, portfolio_metrics
            )

    def _build_analysis_prompt(
        self,
        profile: UserFinancialProfile,
        health_score: MoneyHealthScore,
        portfolio_metrics: PortfolioMetrics
    ) -> str:
        return f"""You are an expert financial advisor analyzing an Indian investor's financial health.

User Profile:
- Age: {profile.age}
- Monthly Income: ₹{profile.monthly_income:,.0f}
- Monthly Expenses: ₹{profile.monthly_expenses:,.0f}
- Total Debt: ₹{profile.total_debt:,.0f}
- Emergency Fund: ₹{profile.emergency_fund:,.0f}
- Risk Profile: {profile.risk_profile}

Money Health Score: {health_score.overall_score}/100 (Grade: {health_score.grade})

Portfolio Metrics:
- Total Invested: ₹{portfolio_metrics.total_invested:,.0f}
- Current Value: ₹{portfolio_metrics.current_value:,.0f}
- Returns: {portfolio_metrics.returns_percentage:.2f}%
- XIRR: {portfolio_metrics.xirr:.2f}% (annualized)
- Equity Exposure: {portfolio_metrics.equity_exposure:.1f}%
- Diversification Score: {portfolio_metrics.diversification_score:.1f}/100

Generate exactly 5 personalized recommendations in JSON format:
[
  {{
    "category": "emergency_fund|debt|investment|tax|insurance|diversification",
    "priority": "high|medium|low",
    "title": "Short actionable title",
    "description": "Specific action with numbers and timeline",
    "potential_impact": "Quantified benefit (e.g., 'Save ₹50,000 annually')"
  }}
]

Focus on:
1. Most critical gaps in financial health
2. Actionable steps with specific amounts
3. Indian tax laws (80C, 80D, etc.)
4. Realistic timelines
5. Quantified impact

Return ONLY valid JSON array, no explanation."""

    def _call_ai_api(self, prompt: str) -> List[AIRecommendation]:
        if self.provider == "openai":
            return self._call_openai(prompt)
        else:
            return self._call_anthropic(prompt)

    def _call_openai(self, prompt: str) -> List[AIRecommendation]:
        import openai
        openai.api_key = self.api_key

        response = openai.ChatCompletion.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are an expert Indian financial advisor."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )

        recommendations_json = response.choices[0].message.content.strip()
        recommendations_data = json.loads(recommendations_json)

        return [AIRecommendation(**rec) for rec in recommendations_data]

    def _call_anthropic(self, prompt: str) -> List[AIRecommendation]:
        import anthropic

        client = anthropic.Anthropic(api_key=self.api_key)

        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1500,
            temperature=0.7,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        recommendations_json = message.content[0].text.strip()
        recommendations_data = json.loads(recommendations_json)

        return [AIRecommendation(**rec) for rec in recommendations_data]

    def _generate_rule_based_recommendations(
        self,
        profile: UserFinancialProfile,
        health_score: MoneyHealthScore,
        portfolio_metrics: PortfolioMetrics
    ) -> List[AIRecommendation]:
        recommendations = []

        emergency_months = profile.emergency_fund / profile.monthly_expenses
        if emergency_months < 6:
            gap = (6 - emergency_months) * profile.monthly_expenses
            recommendations.append(AIRecommendation(
                category="emergency_fund",
                priority="high",
                title="Build Emergency Fund to 6 Months",
                description=f"Allocate ₹{gap:,.0f} to liquid funds over next 12 months via monthly SIP of ₹{gap/12:,.0f}.",
                potential_impact=f"Protect against job loss or medical emergencies worth ₹{6 * profile.monthly_expenses:,.0f}"
            ))

        debt_to_income = (profile.total_debt / profile.annual_income) * 100
        if debt_to_income > 30:
            recommendations.append(AIRecommendation(
                category="debt",
                priority="high",
                title="Aggressive Debt Reduction Plan",
                description=f"Allocate 40% of monthly savings (₹{(profile.monthly_income - profile.monthly_expenses) * 0.4:,.0f}) to high-interest debt repayment.",
                potential_impact=f"Save ₹{profile.total_debt * 0.12:,.0f} annually in interest (assuming 12% rate)"
            ))

        tax_saving_gap = max(0, 150000 - min(profile.total_savings, 150000))
        if tax_saving_gap > 50000:
            tax_savings = tax_saving_gap * 0.312
            recommendations.append(AIRecommendation(
                category="tax",
                priority="high",
                title="Maximize 80C Tax Deduction",
                description=f"Invest ₹{tax_saving_gap:,.0f} in ELSS funds or PPF before March 31 to fully utilize 80C limit.",
                potential_impact=f"Save ₹{tax_savings:,.0f} in taxes (31.2% bracket)"
            ))

        if portfolio_metrics.diversification_score < 50:
            recommendations.append(AIRecommendation(
                category="diversification",
                priority="medium",
                title="Improve Portfolio Diversification",
                description="Add 2-3 funds across different asset classes (equity, debt, gold) to reduce concentration risk.",
                potential_impact="Reduce portfolio volatility by 15-20% and improve risk-adjusted returns"
            ))

        required_life_cover = profile.annual_income * 10
        insurance_gap = required_life_cover - profile.life_insurance_cover
        if insurance_gap > 1000000:
            annual_premium = insurance_gap * 0.0005 * (profile.age / 30)
            recommendations.append(AIRecommendation(
                category="insurance",
                priority="high",
                title="Increase Term Life Insurance",
                description=f"Get additional term cover of ₹{insurance_gap:,.0f} (₹{annual_premium:,.0f}/year premium).",
                potential_impact=f"Protect family with ₹{required_life_cover:,.0f} coverage in case of unfortunate event"
            ))

        if portfolio_metrics.xirr and portfolio_metrics.xirr < 10:
            recommendations.append(AIRecommendation(
                category="investment",
                priority="medium",
                title="Review Underperforming Investments",
                description="Portfolio XIRR below inflation. Consider switching to index funds or aggressive hybrid funds.",
                potential_impact="Potential to improve returns by 3-5% annually, worth ₹30,000-50,000 on ₹10L portfolio"
            ))

        if profile.age < 40 and portfolio_metrics.equity_exposure < 60:
            recommendations.append(AIRecommendation(
                category="investment",
                priority="medium",
                title="Increase Equity Allocation",
                description=f"Your age ({profile.age}) allows higher equity exposure. Gradually increase from {portfolio_metrics.equity_exposure:.0f}% to 70-75%.",
                potential_impact="Historical equity returns of 12-15% vs debt at 6-7% can add ₹2-3L over 10 years"
            ))

        return sorted(recommendations, key=lambda x: {"high": 0, "medium": 1, "low": 2}[x.priority])[:5]

    def generate_risk_assessment(
        self,
        profile: UserFinancialProfile,
        portfolio_metrics: PortfolioMetrics
    ) -> str:
        age_risk = "high" if profile.age > 55 else "moderate" if profile.age > 40 else "low"

        debt_risk = "high" if (profile.total_debt / profile.annual_income) > 0.4 else "moderate" if (profile.total_debt / profile.annual_income) > 0.2 else "low"

        emergency_risk = "high" if (profile.emergency_fund / profile.monthly_expenses) < 3 else "moderate" if (profile.emergency_fund / profile.monthly_expenses) < 6 else "low"

        portfolio_risk = profile.risk_profile

        risk_factors = []
        if age_risk == "high":
            risk_factors.append("approaching retirement age")
        if debt_risk == "high":
            risk_factors.append("high debt burden")
        if emergency_risk == "high":
            risk_factors.append("inadequate emergency fund")
        if portfolio_metrics.diversification_score < 50:
            risk_factors.append("poor portfolio diversification")

        if not risk_factors:
            return f"Your financial risk profile is {portfolio_risk} with a strong foundation. You have manageable debt, adequate emergency fund, and well-diversified portfolio. Continue monitoring and rebalancing annually."

        return f"Your financial risk profile is {portfolio_risk}, but there are concerns: {', '.join(risk_factors)}. Priority should be given to addressing these vulnerabilities before aggressive wealth building."

    def identify_tax_opportunities(
        self, profile: UserFinancialProfile
    ) -> List[str]:
        opportunities = []

        section_80c_used = min(profile.total_savings, 150000)
        section_80c_remaining = 150000 - section_80c_used

        if section_80c_remaining > 0:
            tax_saving = section_80c_remaining * 0.312
            opportunities.append(
                f"Section 80C: Invest ₹{section_80c_remaining:,.0f} in ELSS/PPF/EPF to save ₹{tax_saving:,.0f} in taxes"
            )

        if profile.health_insurance_cover > 0:
            max_deduction = 25000 if profile.age < 60 else 50000
            opportunities.append(
                f"Section 80D: Health insurance premiums deductible up to ₹{max_deduction:,.0f}"
            )
        else:
            opportunities.append(
                "Section 80D: Get health insurance and claim premium deduction up to ₹25,000"
            )

        opportunities.append(
            "NPS Contribution: Additional ₹50,000 tax deduction under Section 80CCD(1B)"
        )

        if profile.has_home:
            opportunities.append(
                "Section 24: Home loan interest deductible up to ₹2,00,000 for self-occupied property"
            )

        if profile.monthly_income * 12 > 1500000:
            opportunities.append(
                "HRA Exemption: Optimize rent payment if living in rented accommodation"
            )

        return opportunities
