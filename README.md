# SkillForge

> An AI-powered career architect that analyzes what students know, identifies what they are missing, builds personalized learning roadmaps, and challenges them to prove what they have learned.

SkillForge is a full-stack, AI-powered career development platform built for the LoopLearn Hackathon 2026.

Students often know what career they want, but not what skills they are missing, how large their skill gaps are, what they should learn next, or whether they have actually developed a skill after learning it.

SkillForge turns that uncertainty into an adaptive career journey.

The platform combines student profiles, assessments, AI-powered skill-gap analysis, personalized roadmaps, a RAG knowledge assistant, an AI Career Architect, AI-generated Boss Battles, automated evaluation, microservices, containerization, Kubernetes, Terraform, and deployment.

The core learning loop is:

```text
Assess
  ↓
Analyze
  ↓
Identify Skill Gaps
  ↓
Build Roadmap
  ↓
Learn / Build
  ↓
Generate Challenge
  ↓
Boss Battle
  ↓
AI Evaluation
  ↓
Measure Progress
  ↓
Repeat
```

---

## Table of Contents

- [Problem](#problem)
- [Solution](#solution)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [How the System Works](#how-the-system-works)
- [AI Career Architect](#ai-career-architect)
- [Boss Battle System](#boss-battle-system)
- [RAG Knowledge Assistant](#rag-knowledge-assistant)
- [Python Skill Engine](#python-skill-engine)
- [Authentication and Authorization](#authentication-and-authorization)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [DevOps and Deployment](#devops-and-deployment)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [Hackathon Requirements Coverage](#hackathon-requirements-coverage)
- [Why SkillForge Is Different](#why-skillforge-is-different)
- [Future Expansion](#future-expansion)
- [Team](#team)

---

# Problem

Students frequently know the career they want to pursue but struggle to answer four important questions:

1. What skills do I currently have?
2. What skills am I missing?
3. What should I learn next?
4. How do I know that I have actually improved?

Traditional learning platforms generally provide static curricula or generic recommendations.

SkillForge instead focuses on personalization.

The platform connects a student's target career, current skills, assessment performance, skill gaps, learning roadmap, and demonstrated performance.

---

# Solution

SkillForge creates an adaptive career development system around the individual student.

The student:

1. Creates an account.
2. Builds a career profile.
3. Selects a target role.
4. Completes a skill assessment.
5. Receives an AI-powered skill-gap analysis.
6. Gets a personalized career roadmap.
7. Uses the RAG knowledge assistant for grounded learning guidance.
8. Interacts with the AI Career Architect.
9. Receives an AI-generated Boss Battle targeting a weakness.
10. Completes the challenge.
11. Has the attempt evaluated by AI.
12. Uses the result to guide the next stage of learning.

The result is a closed learning loop rather than a static recommendation engine.

---

# Key Features

## Student Profiles

Students can create a career profile containing their relevant information, skills, projects, certifications, experience, and target career.

## Skill Assessments

Students complete assessments that produce scores for relevant skills.

These results are combined with self-reported skill levels to create a more useful picture of the student's current capabilities.

## AI Skill Analysis

The Python Skill Engine analyzes the difference between:

- Self-assessed skill level
- Assessment score
- Required skill level

It calculates:

- Skill gap
- Confidence gap
- Required proficiency

These results are persisted and used by the roadmap and Career Architect.

## Personalized Career Roadmaps

The roadmap is generated around the student's target role and current skill gaps.

A roadmap contains:

- Learning phases
- Skills
- Topics
- Reasons for learning each skill
- Practical projects
- Completion criteria

## RAG Knowledge Assistant

The RAG assistant answers student questions using the project's knowledge base and returns the relevant sources used to construct the answer.

## AI Career Architect

The Career Architect reasons over the student's SkillForge state and determines what the student should do next.

## Boss Battles

The Career Architect can turn a student's skill gap into a targeted AI-generated challenge.

## AI Evaluation

After the student completes a challenge, AI evaluates the attempt and provides a score and feedback.

---

# System Architecture

SkillForge is organized as a service-oriented architecture with Next.js as the frontend and Express acting as the primary API gateway.

```text
                         ┌──────────────────────┐
                         │       Next.js        │
                         │      Frontend        │
                         │        :3000         │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP
                                    ▼
                         ┌──────────────────────┐
                         │    Express API       │
                         │       Gateway        │
                         │        :5000         │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
      ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
      │ Authentication│     │ Assessment /  │     │ Career / Boss │
      │ Profile       │     │ Skills        │     │ / Agent       │
      │ Services      │     │ Services      │     │ Services      │
      └───────────────┘     └───────┬───────┘     └───────┬───────┘
                                    │                     │
                                    ▼                     ▼
                           ┌─────────────────┐   ┌─────────────────┐
                           │ Python Skill    │   │ RAG Microservice│
                           │ Engine          │   │      :5001      │
                           │ FastAPI         │   │ Express         │
                           └─────────────────┘   └────────┬────────┘
                                                          │
                                                          ▼
                                                  ┌──────────────┐
                                                  │  Knowledge   │
                                                  │    Base      │
                                                  └──────────────┘

                         ┌──────────────────────────────┐
                         │           MongoDB             │
                         │   Application + RAG Data     │
                         └──────────────────────────────┘
```

The important architectural separation is:

```text
Next.js
   ↓
Express API Gateway
   ↓
┌───────────────────┬───────────────────┐
│                   │                   │
Python Skill      Application        RAG
Engine            Services            Service
```

The Express API provides a single entry point for the frontend while specialized workloads are handled by their respective services.

---

# How the System Works

## 1. Frontend

The student interacts with the Next.js dashboard.

The dashboard handles:

- Authentication screens
- Profile creation
- Assessment
- Skill analysis
- Roadmap visualization
- AI assistant interaction
- Career Architect
- Boss Battles
- Evaluation results
- Progress

The frontend communicates with the Express API rather than directly managing application business logic.

## 2. Express API Gateway

The Express server runs on port `5000`.

It provides:

```text
/api/health
/api/auth
/api/profile
/api/assessment
/api/skills
/api/career
/api/boss
```

The gateway handles authentication, application logic, database operations, and communication with internal AI services.

## 3. Python Skill Engine

For skill analysis:

```text
Express
   ↓
Python Skill Engine
   ↓
Skill Analysis
   ↓
Express
   ↓
Next.js
```

This keeps the analytical Python workload separate from the Node.js application.

## 4. RAG Microservice

The RAG system is an independent Express service running on port `5001`.

```text
Express API Gateway
        ↓
RAG Microservice
        ↓
Embedding
        ↓
Similarity Search
        ↓
Relevant Knowledge
        ↓
Gemini
        ↓
Grounded Answer
        ↓
Express API
        ↓
Next.js
```

## 5. Dashboard

All capabilities are brought together in the SkillForge dashboard:

```text
Profile
Assessment
Skill Analysis
Roadmap
RAG Assistant
Career Architect
Boss Battles
Evaluation
Progress
```

---

# AI Career Architect

The Career Architect is the agentic AI layer of SkillForge.

It is different from a conventional chatbot.

A conventional chatbot primarily responds to a question.

The Career Architect instead reasons about the student's current state and determines the most useful next action.

It can work with:

- Student profile
- Target career
- Current skills
- Assessment scores
- Skill gaps
- Career roadmap
- Knowledge retrieved through RAG
- Boss Battle generation
- Evaluation results

Conceptually:

```text
                    Career Architect
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    Skill Analysis      Roadmap            RAG
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                    Agent Decision
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
           Learn        Project        Boss
```

The agent can determine that the student should:

- Learn a concept
- Work on a project
- Use the RAG assistant for additional information
- Take a challenge
- Fight a Boss Battle

This makes the AI an orchestration layer over the capabilities already available inside SkillForge.

---

# Boss Battle System

The Boss Battle system is SkillForge's signature feature.

Most learning systems follow:

```text
Learn → Complete Course → Move On
```

SkillForge adds a verification loop:

```text
Learn
  ↓
Practice
  ↓
Prove
  ↓
Evaluate
  ↓
Measure
  ↓
Improve
```

## How a Boss Is Created

The process begins with the student's skill analysis.

For example:

```text
Target Role: AI Engineer

Machine Learning
Current Level: 4/10
Required Level: 8/10

Skill Gap: 4
```

The Career Architect can identify Machine Learning as a priority weakness.

It then generates a challenge specifically designed around that gap.

```text
Student Skill Gap
       ↓
Career Architect
       ↓
Select Weak Skill
       ↓
Generate Boss
       ↓
Generate Challenge
```

The student attempts the challenge:

```text
Boss Challenge
      ↓
Student Attempt
      ↓
AI Evaluation
      ↓
Score + Feedback
```

The important idea is that SkillForge does not only tell a student:

> You need to learn Machine Learning.

It can instead say:

> Your Machine Learning gap is significant. Here is a challenge designed to test whether you can actually apply it.

That makes the student's progress measurable through demonstrated ability rather than only self-reported confidence.

---

# RAG Knowledge Assistant

The RAG system provides grounded answers using the SkillForge knowledge base.

## Retrieval Pipeline

```text
User Question
      ↓
Generate Embedding
      ↓
Compare With Knowledge Embeddings
      ↓
Calculate Similarity
      ↓
Rank Knowledge Chunks
      ↓
Select Top Results
      ↓
Construct Context
      ↓
Gemini
      ↓
Grounded Answer
```

The system stores knowledge as chunks with their corresponding embeddings.

When a question arrives:

1. The question is converted into an embedding.
2. The embedding is compared against stored knowledge.
3. Relevant chunks are ranked.
4. The highest-ranking chunks are selected.
5. They are provided to Gemini as context.
6. Gemini generates the final response.
7. Relevant sources are returned with the answer.

This allows the assistant to provide career and learning guidance grounded in the project's knowledge base.

---

# Python Skill Engine

The Python microservice is implemented using FastAPI.

Its purpose is to isolate skill-analysis logic from the main Express application.

The engine receives structured skill information such as:

```json
{
  "name": "Machine Learning",
  "self_score": 5,
  "assessment_score": 4
}
```

along with the student's target role.

It produces analysis containing values such as:

```text
Self Score
Assessment Score
Required Score
Skill Gap
Confidence Gap
```

The result is sent back to the Express API and persisted in MongoDB.

This demonstrates Python as a dedicated microservice rather than embedding Python scripts inside the Node.js application.

---

# Authentication and Authorization

SkillForge implements user registration and login.

Protected routes use authentication middleware to identify the current user before accessing user-specific resources.

The flow is:

```text
Login
  ↓
Authentication
  ↓
Token
  ↓
Protected Request
  ↓
Authentication Middleware
  ↓
User Identification
  ↓
User-specific Data
```

This keeps student data isolated between users.

---

# Data Flow

A complete student journey through the architecture looks like this:

```text
                    Student
                       │
                       ▼
                  Next.js
                       │
                       ▼
                Express API
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       MongoDB      Python         RAG
                   Service       Service
                       │            │
                       │            ▼
                       │         Gemini
                       │            │
                       └─────┬──────┘
                             ▼
                      Career Architect
                             │
                             ▼
                       Boss Generator
                             │
                             ▼
                       AI Evaluator
                             │
                             ▼
                          MongoDB
                             │
                             ▼
                         Dashboard
```

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript

## Backend

- Node.js
- Express
- MongoDB
- Mongoose

## Skill Analysis

- Python
- FastAPI

## Artificial Intelligence

- Google Gemini
- Generative AI
- Agentic AI
- AI-generated roadmaps
- AI-generated Boss Battles
- AI-powered evaluation

## Retrieval-Augmented Generation

- Gemini Embeddings
- Similarity-based retrieval
- MongoDB knowledge base
- Grounded generation

## DevOps

- Docker
- Docker Compose
- Kubernetes
- Terraform
- Linux shell scripting

---

# DevOps and Deployment

SkillForge was developed as a multi-service application and containerized for deployment.

The main services can be independently packaged as containers:

```text
Next.js
   │
   └── Container

Express API
   │
   └── Container

Python Skill Engine
   │
   └── Container

RAG Service
   │
   └── Container
```

Docker Compose provides local multi-service orchestration.

Kubernetes manifests provide container orchestration configuration.

Terraform provides Infrastructure as Code.

The deployment architecture allows individual components to be managed independently while still operating as one application.

---

# Project Structure

```text
SkillForge/
│
├── apps/
│   ├── web/
│   │   └── ...
│   │
│   └── api/
│       └── ...
│
├── services/
│   ├── skill-engine/
│   │   └── ...
│   │
│   └── ai/
│       └── ...
│
├── infra/
│   ├── kubernetes/
│   └── terraform/
│
├── scripts/
│   └── ...
│
├── docker-compose.yml
└── README.md
```

---

# API Overview

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Profile

```text
GET  /api/profile
POST /api/profile
```

## Assessment

```text
POST /api/assessment
```

## Skills

```text
POST /api/skills/analyze
```

## Career

```text
GET /api/career/roadmap
```

## Boss

```text
POST /api/boss/generate
POST /api/boss/evaluate
```

## RAG

The RAG microservice exposes:

```text
POST /api/ai/ask
```

on port `5001`.

---

# Running Locally

## Prerequisites

- Node.js
- Python
- Docker
- Docker Compose
- MongoDB
- Git

## Clone

```bash
git clone <YOUR_REPOSITORY_URL>
cd SkillForge
```

## Environment Variables

Create the required environment files.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
AI_SERVICE_URL=http://localhost:5001
```

Never commit actual credentials to the repository.

## Run With Docker

```bash
docker compose up --build
```

Typical development ports:

```text
Frontend       http://localhost:3000
Express API    http://localhost:5000
RAG Service    http://localhost:5001
```

---

# Hackathon Requirements Coverage

SkillForge was built to cover the core technical requirements of the hackathon.

| Requirement | SkillForge Implementation |
|---|---|
| Python + OOP | Python Skill Engine |
| Web Development | Next.js dashboard |
| Linux + Shell Scripting | Deployment and automation scripts |
| GitHub | Collaborative Git development |
| Authentication | Express authentication system |
| Authorization | Protected API routes |
| MERN Stack | MongoDB, Express, React/Next.js, Node.js |
| Generative AI | Gemini-powered AI features |
| Agentic AI | Career Architect |
| RAG | Knowledge-grounded AI Assistant |
| Docker | Containerized services |
| Kubernetes | Kubernetes configuration |
| API Gateway | Express API Gateway |
| Microservices | Express, Python and RAG services |
| Terraform | Infrastructure as Code |
| Deployment | Deployed application |

---

# Why SkillForge Is Different

SkillForge is not simply:

- A chatbot
- A course recommendation system
- A skill assessment form
- A static career roadmap

It combines these capabilities into a single adaptive system.

The core loop is:

```text
What do you want to become?
          ↓
What do you know?
          ↓
What are you missing?
          ↓
What should you learn?
          ↓
What should you build?
          ↓
Can you prove you learned it?
          ↓
What should you do next?
```

The Boss Battle system makes this loop tangible.

The AI does not only recommend a learning path.

It can identify a weakness and create a challenge designed to test that weakness.

That transforms SkillForge from a passive recommendation platform into an interactive career development system.

---

# Future Expansion

Potential future improvements include:

- Mentor workflows
- Advanced administrative tooling
- GitHub repository analysis
- CV and resume analysis
- Adaptive assessments
- Skill dependency graphs
- Persistent learning history
- More advanced vector search
- Automated resource recommendations
- Industry-specific career paths
- More sophisticated multi-tool agents
- Real-time progress tracking

---

# Team

Built by a team homies, **Ebadullah Siddique and Hassan Mujtaba**.

---

# Final Note

SkillForge is built around one idea:

> A career roadmap should not be static.

It should respond to:

- What a student already knows
- What the student is missing
- What the student should learn next
- What the student can build
- What the student can actually prove

SkillForge turns those signals into an adaptive learning journey.

```text
Assess → Analyze → Plan → Learn → Prove → Evaluate → Improve
```
