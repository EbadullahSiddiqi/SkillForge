from pydantic import BaseModel


class Skill(BaseModel):
    name: str
    self_score: float
    assessment_score: float


class SkillAnalysisRequest(BaseModel):
    target_role: str
    skills: list[Skill]


class RoadmapRequest(BaseModel):
    target_role: str
    skills: list[Skill]
