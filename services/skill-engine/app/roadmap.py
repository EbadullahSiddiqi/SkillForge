from .dependencies import SKILL_DEPENDENCIES
from .roles import ROLE_REQUIREMENTS


class RoadmapEngine:

    def prerequisite_blocked(self, skill_name, skill_map, dependencies):
        prerequisites = dependencies.get(skill_name, [])

        blocked_by = []

        for prerequisite in prerequisites:

            skill = skill_map.get(prerequisite)

            if not skill:
                blocked_by.append(prerequisite)
                continue

            if skill.assessment_score < 6:
                blocked_by.append(prerequisite)

        return blocked_by

    def generate(self, target_role, skills):

        requirements = ROLE_REQUIREMENTS.get(target_role)

        dependencies = SKILL_DEPENDENCIES.get(target_role, {})

        if not requirements:
            raise ValueError(f"Unsupported target role: {target_role}")

        skill_map = {skill.name: skill for skill in skills}

        roadmap_skills = []

        # 👇 THIS is the loop we're talking about
        for skill_name, required_score in requirements.items():

            skill = skill_map.get(skill_name)

            current_score = skill.assessment_score if skill else 0

            self_score = skill.self_score if skill else 0

            gap = max(required_score - current_score, 0)

            confidence_gap = round(self_score - current_score, 2)

            # 👇 ADD IT HERE
            blocked_by = self.prerequisite_blocked(skill_name, skill_map, dependencies)

            priority = (
                gap * 0.6
                + max(confidence_gap, 0) * 0.2
                + (1 if not blocked_by else 0) * 2
            )

            roadmap_skills.append(
                {
                    "name": skill_name,
                    "currentScore": current_score,
                    "requiredScore": required_score,
                    "gap": round(gap, 2),
                    "confidenceGap": confidence_gap,
                    "prerequisites": dependencies.get(skill_name, []),
                    # 👇 AND ADD blockedBy HERE
                    "blockedBy": blocked_by,
                    "priority": round(priority, 2),
                }
            )

        roadmap_skills.sort(key=lambda skill: skill["priority"], reverse=True)

        return {"skills": roadmap_skills, "phases": build_phases(roadmap_skills)}

    def build_phases(skills):

        phases = []

        for index, skill in enumerate(skills):

            phase = {
                "phase": index + 1,
                "title": skill["name"],
                "skills": [skill],
            }

            phases.append(phase)

        return phases
