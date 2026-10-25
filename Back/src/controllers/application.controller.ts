
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
  async updateStatus(req: Request, res: Response) {
    try {
      const applicationId = req.params.applicationId;

      if (typeof applicationId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID",
        });
      }

      const application = await applicationService.updateStatus(
        applicationId,
        req.body?.status
      );

      res.status(200).json({
        success: true,
        data: application,
        message: "Hiring stage updated successfully",
      });
    } catch (error) {
      const statusCode =
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error &&
        typeof error.statusCode === "number"
          ? error.statusCode
          : error instanceof Error &&
              error.message === "Invalid application status"
            ? 400
            : 500;

      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update hiring stage",
      });
    }
  },
};
