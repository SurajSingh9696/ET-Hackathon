from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    PortfolioAnalysisRequest,
    ComprehensiveAnalysis
)
from app.services.financial_analysis_service import FinancialAnalysisService

router = APIRouter()
analysis_service = FinancialAnalysisService()


@router.post("/analyze", response_model=ComprehensiveAnalysis)
async def analyze_financial_health(request: PortfolioAnalysisRequest):
    try:
        result = analysis_service.perform_comprehensive_analysis(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI Money Mentor API"}
