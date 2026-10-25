
import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/db.js";
import jobRouter from "./routes/job.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import applicationRouter from "./routes/application.routes.js";
import matchReportRouter from "./routes/match-report.routes.js";
import rankingRouter from "./routes/ranking.routes.js";


// After express.json() and your health endpoints:
const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Mini ATS API is running",
  });
});

app.use("/api/jobs", jobRouter);
app.use("/api/jobs", resumeRouter);
app.use("/api/jobs", applicationRouter);
app.use("/api/jobs", matchReportRouter);
app.use("/api/jobs", rankingRouter);


export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Mini ATS API running at http://localhost:${PORT}`);
  });
}

async function shutdown() {
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
