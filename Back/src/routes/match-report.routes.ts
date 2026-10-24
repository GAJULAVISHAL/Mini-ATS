
import { Router } from "express";
import { matchReportController } from "../controllers/match-report.controller.js";

const matchReportRouter = Router();

matchReportRouter.post(
  "/applications/:applicationId/match-report",
  matchReportController.generate
);

export default matchReportRouter;
