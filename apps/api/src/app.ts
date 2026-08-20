import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import healthRouter from "./routes/health.routes.js";
import assessmentRouter from "./routes/assessment.routes.js";
import skillRouter from "./routes/skill.routes.js";

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

export default app;
