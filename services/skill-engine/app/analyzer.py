from .roles import ROLE_REQUIREMENTS


class SkillAnalyzer:

    def analyze(self, target_role, skills):

        requirements = ROLE_REQUIREMENTS.get(target_role)

        if not requirements:
            raise ValueError(f"Unsupported target role: {target_role}")

        results = []

        for skill in skills:

            required = requirements.get(skill.name, 0)

            skill_gap = max(required - skill.assessment_score, 0)

            confidence_gap = round(skill.self_score - skill.assessment_score, 2)

            results.append(
                {
                    "name": skill.name,
                    "selfScore": skill.self_score,
                    "assessmentScore": skill.assessment_score,
                    "requiredScore": required,
                    "skillGap": round(skill_gap, 2),
                    "confidenceGap": confidence_gap,
                }
            )

        results.sort(key=lambda x: x["skillGap"], reverse=True)

        return results
