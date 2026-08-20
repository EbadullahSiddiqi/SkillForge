class SkillAnalyzer:

    def analyze(self, skills):
        results = []

        for skill in skills:
            gap = max(skill.required - skill.current, 0)

            results.append(
                {
                    "name": skill.name,
                    "current": skill.current,
                    "required": skill.required,
                    "gap": round(gap, 2),
                }
            )

        results.sort(key=lambda skill: skill["gap"], reverse=True)

        return results
