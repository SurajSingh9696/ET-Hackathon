import numpy as np
from datetime import date, timedelta
from typing import List, Dict, Optional
from app.models.schemas import InvestmentHolding, PortfolioMetrics, AssetClass


class PortfolioAnalyzer:

    def analyze_portfolio(
        self, holdings: List[InvestmentHolding]
    ) -> PortfolioMetrics:
        total_invested = sum(h.invested_amount for h in holdings)
        current_value = sum(h.current_value for h in holdings)
        absolute_returns = current_value - total_invested

        returns_percentage = (
            (absolute_returns / total_invested) * 100 if total_invested > 0 else 0
        )

        xirr = self._calculate_xirr(holdings)
        asset_allocation = self._calculate_asset_allocation(holdings)
        diversification_score = self._calculate_diversification_score(
            holdings, asset_allocation
        )

        equity_exposure = asset_allocation.get(AssetClass.EQUITY, 0)
        debt_exposure = asset_allocation.get(AssetClass.DEBT, 0)

        return PortfolioMetrics(
            total_invested=round(total_invested, 2),
            current_value=round(current_value, 2),
            absolute_returns=round(absolute_returns, 2),
            returns_percentage=round(returns_percentage, 2),
            xirr=round(xirr, 2) if xirr else None,
            asset_allocation={k: round(v, 2) for k, v in asset_allocation.items()},
            diversification_score=round(diversification_score, 2),
            equity_exposure=round(equity_exposure, 2),
            debt_exposure=round(debt_exposure, 2)
        )

    def _calculate_xirr(
        self, holdings: List[InvestmentHolding]
    ) -> Optional[float]:
        if not holdings:
            return None

        cash_flows = []
        dates_list = []

        for holding in holdings:
            cash_flows.append(-holding.invested_amount)
            dates_list.append(holding.purchase_date)

        cash_flows.append(sum(h.current_value for h in holdings))
        dates_list.append(date.today())

        try:
            xirr = self._xirr_calculation(cash_flows, dates_list)
            return xirr * 100
        except:
            return None

    def _xirr_calculation(
        self, cash_flows: List[float], dates: List[date], guess: float = 0.1
    ) -> float:
        max_iterations = 100
        tolerance = 1e-6

        rate = guess
        for _ in range(max_iterations):
            npv = 0
            npv_derivative = 0
            reference_date = dates[0]

            for cf, dt in zip(cash_flows, dates):
                days_diff = (dt - reference_date).days
                years = days_diff / 365.25

                npv += cf / ((1 + rate) ** years)
                npv_derivative -= cf * years / ((1 + rate) ** (years + 1))

            if abs(npv) < tolerance:
                return rate

            rate = rate - npv / npv_derivative

        return rate

    def _calculate_asset_allocation(
        self, holdings: List[InvestmentHolding]
    ) -> Dict[str, float]:
        total_value = sum(h.current_value for h in holdings)
        if total_value == 0:
            return {}

        allocation = {}
        for holding in holdings:
            asset_class = holding.asset_class
            if asset_class not in allocation:
                allocation[asset_class] = 0
            allocation[asset_class] += holding.current_value

        return {
            k: (v / total_value) * 100 for k, v in allocation.items()
        }

    def _calculate_diversification_score(
        self, holdings: List[InvestmentHolding], asset_allocation: Dict[str, float]
    ) -> float:
        num_holdings = len(holdings)
        num_asset_classes = len(asset_allocation)

        holding_concentration = self._calculate_holding_concentration(holdings)

        ideal_holdings = 8
        holding_score = min(num_holdings / ideal_holdings, 1.0) * 40

        ideal_asset_classes = 4
        asset_class_score = min(num_asset_classes / ideal_asset_classes, 1.0) * 30

        concentration_score = (1 - holding_concentration) * 30

        total_score = holding_score + asset_class_score + concentration_score

        return total_score

    def _calculate_holding_concentration(
        self, holdings: List[InvestmentHolding]
    ) -> float:
        total_value = sum(h.current_value for h in holdings)
        if total_value == 0:
            return 1.0

        percentages = [h.current_value / total_value for h in holdings]
        hhi = sum(p ** 2 for p in percentages)

        return hhi

    def get_rebalancing_suggestions(
        self,
        current_allocation: Dict[str, float],
        risk_profile: str,
        age: int
    ) -> List[str]:
        target_allocation = self._get_target_allocation(risk_profile, age)

        suggestions = []
        for asset_class, target_pct in target_allocation.items():
            current_pct = current_allocation.get(asset_class, 0)
            diff = current_pct - target_pct

            if abs(diff) > 10:
                if diff > 0:
                    suggestions.append(
                        f"Reduce {asset_class} exposure by {abs(diff):.1f}% "
                        f"(currently {current_pct:.1f}%, target {target_pct:.1f}%)"
                    )
                else:
                    suggestions.append(
                        f"Increase {asset_class} exposure by {abs(diff):.1f}% "
                        f"(currently {current_pct:.1f}%, target {target_pct:.1f}%)"
                    )

        return suggestions

    def _get_target_allocation(self, risk_profile: str, age: int) -> Dict[str, float]:
        equity_percent = min(100 - age, 80)

        if risk_profile == "conservative":
            equity_percent = min(equity_percent * 0.7, 40)
        elif risk_profile == "aggressive":
            equity_percent = min(equity_percent * 1.2, 90)

        debt_percent = 100 - equity_percent - 10

        return {
            AssetClass.EQUITY: equity_percent,
            AssetClass.DEBT: debt_percent,
            AssetClass.GOLD: 10
        }
