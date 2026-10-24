
import type { Request, Response } from "express";
import { applicationService } from "../services/application.service.js";

export const applicationController = {
  async findByJobId(req: Request, res: Response) {
    try {
      const jobId = req.params.jobId;

      if (typeof jobId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID",
        });
      }

      const result = await applicationService.getApplicationsByJobId(jobId);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const err = error as Error & { statusCode?: number };

      if (err.statusCode === 404) {
        return res.status(404).json({
          success: false,
          message: err.message,
        });
      }

      console.error("Failed to fetch applications:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch applications",
      });
    }
  },
};
