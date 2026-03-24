from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analysis

app = FastAPI(
    title="AI Money Mentor API",
    description="Intelligent financial health analysis and portfolio insights",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router, prefix="/api/v1", tags=["Analysis"])


@app.get("/")
async def root():
    return {
        "message": "AI Money Mentor API",
        "version": "1.0.0",
        "status": "operational"
    }
