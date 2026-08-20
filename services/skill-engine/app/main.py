from fastapi import FastAPI

from .models import SkillAnalysisRequest, RoadmapRequest
from .analyzer import SkillAnalyzer
from .roles import ROLE_REQUIREMENTS
from .roadmap import RoadmapEngine

app = FastAPI(title="SkillForge Skill Engine")

analyzer = SkillAnalyzer()

roadmap_engine = RoadmapEngine()


@app.get("/health")
def health():
    return {"success": True, "service": "skill-engine"}


@app.get("/roles")
def get_roles():
    return {"success": True, "roles": list(ROLE_REQUIREMENTS.keys())}


@app.post("/analyze")
def analyze(request: SkillAnalysisRequest):

    try:

        results = analyzer.analyze(request.target_role, request.skills)

        return {"success": True, "target_role": request.target_role, "skills": results}

    except ValueError as error:

        return {"success": False, "message": str(error)}


@app.post("/roadmap")
def generate_roadmap(request: RoadmapRequest):

    try:

        roadmap = roadmap_engine.generate(request.target_role, request.skills)

        return {"success": True, "target_role": request.target_role, "roadmap": roadmap}

    except ValueError as error:

        return {"success": False, "message": str(error)}
