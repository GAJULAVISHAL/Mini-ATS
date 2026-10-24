
import { Router } from "express";
import { applicationController } from "../controllers/application.controller.js";

const applicationRouter = Router();

applicationRouter.get(
  "/:jobId/applications",
  applicationController.findByJobId
);

export default applicationRouter;
