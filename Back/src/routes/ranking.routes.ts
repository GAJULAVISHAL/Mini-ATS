
import { Router } from "express";
import { rankingController } from "../controllers/ranking.controller.js";

const rankingRouter = Router();

rankingRouter.get(
  "/:jobId/rankings",
  rankingController.getRankings
);

export default rankingRouter;
