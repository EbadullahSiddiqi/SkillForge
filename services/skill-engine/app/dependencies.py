SKILL_DEPENDENCIES = {
    "AI Engineer": {
        "Python": [],
        "Git": [],
        "Databases": [],
        "Docker": ["Git"],
        "Machine Learning": ["Python"],
        "Deep Learning": ["Python", "Machine Learning"],
        "AI": ["Python", "Machine Learning"],
        "LLM Engineering": ["Python", "AI"],
    },
    "Full Stack Developer": {
        "JavaScript": [],
        "Git": [],
        "Databases": [],
        "React": ["JavaScript"],
        "Web Development": ["JavaScript"],
        "Docker": ["Git"],
    },
    "DevOps Engineer": {
        "Linux": [],
        "Git": [],
        "Docker": ["Linux", "Git"],
        "Kubernetes": ["Docker"],
        "Cloud": ["Linux", "Docker"],
    },
}
