
import type { Request, Response } from "express";
import { matchReportService } from "../services/match-report.service.js";

export const matchReportController = {
  async generate(req: Request, res: Response) {
    try {
      const applicationId = req.params.applicationId;

      if (typeof applicationId !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID",
        });
      }

      const result =
        await matchReportService.generateForApplication(applicationId);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const err = error as Error & { statusCode?: number };

      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }

      console.error("Failed to generate match report:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to generate match report",
      });
    }
  },
};
