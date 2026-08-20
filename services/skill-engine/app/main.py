from fastapi import FastAPI

from .models import SkillAnalysisRequest
from .analyzer import SkillAnalyzer

app = FastAPI(title="SkillForge Skill Engine")

analyzer = SkillAnalyzer()


@app.get("/health")
def health():
    return {"success": True, "service": "skill-engine"}


@app.post("/analyze")
def analyze(request: SkillAnalysisRequest):

    results = analyzer.analyze(request.skills)

    return {"target_role": request.target_role, "skills": results}
