
import type { Request, Response } from "express";
import { rankingService } from "../services/ranking.service.js";

export const rankingController = {
  async getRankings(req: Request, res: Response) {
    try {
      const jobId = req.params.jobId;
      if (typeof jobId !== "string") {
        return res.status(400).json({
          success: false,
          message: "A valid job ID is required",
        });
      }

      const result = await rankingService.getRankings(jobId);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const err = error as Error & {
        statusCode?: number;
      };

      if (err.statusCode) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }

      console.error("Failed to fetch rankings:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch candidate rankings",
      });
    }
  },
};
