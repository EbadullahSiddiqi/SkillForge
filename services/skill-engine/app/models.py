from pydantic import BaseModel


class Skill(BaseModel):
    name: str
    current: float
    required: float


class SkillAnalysisRequest(BaseModel):
    target_role: str
    skills: list[Skill]
