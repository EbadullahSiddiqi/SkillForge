import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import healthRouter from "./routes/health.routes.js";
import assessmentRouter from "./routes/assessment.routes.js";
import skillRouter from "./routes/skill.routes.js";
import careerRouter from "./routes/career.routes.js";
import bossRouter from "./routes/boss.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(express.json());

app.use("/api/health", healthRouter);

app.use("/api/auth", authRouter);

app.use("/api/profile", profileRouter);

app.use("/api/assessment", assessmentRouter);

app.use("/api/skills", skillRouter);

app.use("/api/career", careerRouter);

app.use("/api/boss", bossRouter);

export default app;
