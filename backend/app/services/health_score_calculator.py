from app.models.schemas import (
    UserFinancialProfile, HealthScoreDimension, MoneyHealthScore
)
from typing import List


class HealthScoreCalculator:

    def calculate_comprehensive_score(
        self, profile: UserFinancialProfile
    ) -> MoneyHealthScore:
        dimensions = [
            self._calculate_savings_score(profile),
            self._calculate_debt_score(profile),
            self._calculate_emergency_fund_score(profile),
            self._calculate_investment_score(profile),
            self._calculate_insurance_score(profile),
            self._calculate_tax_efficiency_score(profile)
        ]

        overall_score = sum(d.score for d in dimensions) / len(dimensions)
        grade = self._get_grade(overall_score)

        return MoneyHealthScore(
            overall_score=round(overall_score, 2),
            grade=grade,
            dimensions=dimensions
        )

    def _calculate_savings_score(
        self, profile: UserFinancialProfile
    ) -> HealthScoreDimension:
        monthly_savings = profile.monthly_income - profile.monthly_expenses
        savings_rate = (monthly_savings / profile.monthly_income) * 100

        if savings_rate >= 30:
            score = 100
            status = "Excellent"
            recommendations = [
                "Outstanding savings discipline! Consider increasing investments."
            ]
        elif savings_rate >= 20:
            score = 80
            status = "Good"
            recommendations = [
                "Good savings rate. Try to increase to 30% for faster wealth building."
            ]
        elif savings_rate >= 10:
            score = 60
            status = "Average"
            recommendations = [
                "Increase savings rate to minimum 20% of income.",
                "Review and cut discretionary expenses by 10%."
            ]
        else:
            score = 30
            status = "Needs Improvement"
            recommendations = [
                "Critical: Savings rate below 10% - review expenses urgently.",
                "Create a budget and identify areas to reduce spending.",
                "Aim for minimum 20% savings rate."
            ]

        return HealthScoreDimension(
            dimension="Savings Discipline",
            score=score,
            status=status,
            recommendations=recommendations
        )

    def _calculate_debt_score(
        self, profile: UserFinancialProfile
    ) -> HealthScoreDimension:
        debt_to_income = (profile.total_debt / profile.annual_income) * 100

        if debt_to_income == 0:
            score = 100
            status = "Excellent"
            recommendations = ["Debt-free status - maintain this position!"]
        elif debt_to_income <= 20:
            score = 85
            status = "Good"
            recommendations = [
                "Low debt levels. Consider prepaying to become debt-free faster."
            ]
        elif debt_to_income <= 40:
            score = 65
            status = "Average"
            recommendations = [
                "Debt at moderate level. Create aggressive repayment plan.",
                "Avoid taking new loans until existing debt reduces to <20%."
            ]
        else:
            score = 35
            status = "Critical"
            recommendations = [
                "High debt burden - immediate action needed.",
                "Consolidate high-interest loans to lower rates.",
                "Stop discretionary spending and focus on debt repayment.",
                "Consider debt counseling if needed."
            ]

        return HealthScoreDimension(
            dimension="Debt Management",
            score=score,
            status=status,
            recommendations=recommendations
        )

    def _calculate_emergency_fund_score(
        self, profile: UserFinancialProfile
    ) -> HealthScoreDimension:
        months_covered = profile.emergency_fund / profile.monthly_expenses

        if months_covered >= 6:
            score = 100
            status = "Excellent"
            recommendations = [
                "Strong emergency fund in place - you're well protected!"
            ]
        elif months_covered >= 3:
            score = 70
            status = "Good"
            recommendations = [
                "Build emergency fund to cover 6 months of expenses.",
                f"Need additional ₹{int((6 - months_covered) * profile.monthly_expenses):,}"
            ]
        elif months_covered >= 1:
            score = 40
            status = "Weak"
            recommendations = [
                "Emergency fund critically low - high financial risk.",
                "Prioritize building 6 months of expenses in liquid funds.",
                "Pause investments temporarily to build emergency corpus."
            ]
        else:
            score = 20
            status = "Critical"
            recommendations = [
                "No emergency fund - urgent action required!",
                "Start with ₹50,000 in liquid fund immediately.",
                "Build to 6 months expenses as top priority."
            ]

        return HealthScoreDimension(
            dimension="Emergency Fund",
            score=score,
            status=status,
            recommendations=recommendations
        )

    def _calculate_investment_score(
        self, profile: UserFinancialProfile
    ) -> HealthScoreDimension:
        investment_rate = (profile.total_savings / profile.annual_income) * 100

        if investment_rate >= 30:
            score = 100
            status = "Excellent"
            recommendations = [
                "Outstanding investment discipline!",
                "Ensure proper diversification across asset classes."
            ]
        elif investment_rate >= 20:
            score = 75
            status = "Good"
            recommendations = [
                "Good investment rate. Aim to increase to 30%.",
                "Review asset allocation annually."
            ]
        elif investment_rate >= 10:
            score = 50
            status = "Average"
            recommendations = [
                "Increase investment rate to minimum 20%.",
                "Start systematic investment plans (SIP) immediately."
            ]
        else:
            score = 25
            status = "Poor"
            recommendations = [
                "Very low investment rate - wealth building at risk.",
                "Start SIPs worth 20% of monthly income.",
                "Review financial goals and create investment plan."
            ]

        return HealthScoreDimension(
            dimension="Investment Discipline",
            score=score,
            status=status,
            recommendations=recommendations
        )

    def _calculate_insurance_score(
        self, profile: UserFinancialProfile
    ) -> HealthScoreDimension:
        required_life_cover = profile.annual_income * 10
        required_health_cover = 500000 * (1 + profile.dependents)

        life_adequacy = (profile.life_insurance_cover / required_life_cover) * 100
        health_adequacy = (
            profile.health_insurance_cover / required_health_cover
        ) * 100

        combined_adequacy = (life_adequacy + health_adequacy) / 2

        if combined_adequacy >= 80:
            score = 100
            status = "Excellent"
            recommendations = [
                "Adequate insurance protection in place.",
                "Review coverage annually as income grows."
            ]
        elif combined_adequacy >= 50:
            score = 65
            status = "Adequate"
            recommendations = [
                f"Increase life insurance to ₹{int(required_life_cover):,}",
                f"Increase health insurance to ₹{int(required_health_cover):,}"
            ]
        else:
            score = 35
            status = "Insufficient"
            recommendations = [
                "Severely underinsured - immediate action needed!",
                f"Get term life insurance of ₹{int(required_life_cover):,}",
                f"Get health insurance of ₹{int(required_health_cover):,}",
                "Insurance should be priority #1 before investments."
            ]

        return HealthScoreDimension(
            dimension="Insurance Protection",
            score=score,
            status=status,
            recommendations=recommendations
        )

    def _calculate_tax_efficiency_score(
        self, profile: UserFinancialProfile
    ) -> HealthScoreDimension:
        tax_saving_investments = min(profile.total_savings, 150000)
        efficiency = (tax_saving_investments / 150000) * 100

        if efficiency >= 80:
            score = 100
            status = "Excellent"
            recommendations = [
                "Maximizing tax benefits under Section 80C/80D.",
                "Consider NPS for additional ₹50,000 deduction."
            ]
        elif efficiency >= 50:
            score = 70
            status = "Good"
            recommendations = [
                f"Invest ₹{int(150000 - tax_saving_investments):,} more in ELSS/PPF for tax savings.",
                "Optimize to save up to ₹46,800 annually."
            ]
        else:
            score = 40
            status = "Poor"
            recommendations = [
                "Missing significant tax savings opportunities!",
                "Invest ₹1.5L in 80C (ELSS, PPF, EPF) to save ₹46,800 tax.",
                "Get health insurance for 80D deduction up to ₹25,000."
            ]

        return HealthScoreDimension(
            dimension="Tax Efficiency",
            score=score,
            status=status,
            recommendations=recommendations
        )

    def _get_grade(self, score: float) -> str:
        if score >= 85:
            return "A+"
        elif score >= 75:
            return "A"
        elif score >= 65:
            return "B+"
        elif score >= 55:
            return "B"
        elif score >= 45:
            return "C"
        else:
            return "D"
