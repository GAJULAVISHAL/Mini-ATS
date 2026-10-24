
import { Router } from "express";
import { jobController } from "../controllers/job.controller.js";

const jobRouter = Router();

jobRouter.post("/", jobController.create);
jobRouter.get("/", jobController.findAll);
jobRouter.get("/:id", jobController.findById);

export default jobRouter;
