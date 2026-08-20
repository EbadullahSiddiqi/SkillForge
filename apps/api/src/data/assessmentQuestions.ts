export const assessmentQuestions = [
  {
    id: "python-1",
    skill: "Python",
    difficulty: "easy",
    question: "What is the output of: print(type([]))?",
    options: ["list", "<class 'list'>", "array", "List"],
    answer: "<class 'list'>",
  },

  {
    id: "python-2",
    skill: "Python",
    difficulty: "medium",
    question:
      "Which Python feature allows a class to inherit from another class?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
    answer: "Inheritance",
  },

  {
    id: "web-1",
    skill: "Web Development",
    difficulty: "easy",
    question: "Which HTTP method is normally used to create a resource?",
    options: ["GET", "POST", "DELETE", "PATCH"],
    answer: "POST",
  },

  {
    id: "git-1",
    skill: "Git",
    difficulty: "easy",
    question: "Which command creates a new Git branch?",
    options: [
      "git branch feature",
      "git new feature",
      "git create feature",
      "git fork feature",
    ],
    answer: "git branch feature",
  },

  {
    id: "docker-1",
    skill: "Docker",
    difficulty: "easy",
    question: "What is the primary purpose of a Dockerfile?",
    options: [
      "Store database data",
      "Define how an image is built",
      "Manage Git branches",
      "Deploy Kubernetes",
    ],
    answer: "Define how an image is built",
  },

  {
    id: "ai-1",
    skill: "AI",
    difficulty: "easy",
    question: "What does RAG primarily allow an AI system to do?",
    options: [
      "Train a model from scratch",
      "Retrieve external knowledge before generating an answer",
      "Replace a database",
      "Compile Python code",
    ],
    answer: "Retrieve external knowledge before generating an answer",
  },

  {
    id: "database-1",
    skill: "Databases",
    difficulty: "easy",
    question: "Which database model does MongoDB use?",
    options: ["Relational", "Document", "Graph", "Key-value"],
    answer: "Document",
  },

  {
    id: "devops-1",
    skill: "DevOps",
    difficulty: "medium",
    question: "What problem does containerization primarily solve?",
    options: [
      "It guarantees bug-free software",
      "It provides consistent application environments",
      "It replaces version control",
      "It eliminates the need for servers",
    ],
    answer: "It provides consistent application environments",
  },
];
