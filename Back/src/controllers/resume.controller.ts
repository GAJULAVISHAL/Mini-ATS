
import type { Request, Response } from "express";
import { resumeService } from "../services/resume.service.js";

export const resumeController = {
  async upload(req: Request, res: Response) {
    const files = req.files as Express.Multer.File[] | undefined;
    const { jobId } = req.params;

    if (typeof jobId !== "string") {
      res.status(400).json({
        success: false,
        message: "A valid job ID is required",
      });
      return;
    }

    if (!files?.length) {
      res.status(400).json({
        success: false,
        message: "Upload at least one PDF or DOCX resume",
      });
      return;
    }

    try {
      const data = await resumeService.uploadBatch(
        jobId,
        files,
      );

      res.status(201).json({
        success: true,
        message: "Resume upload batch processed",
        data,
      });
    } catch (error) {
      const statusCode =
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error &&
        typeof error.statusCode === "number"
          ? error.statusCode
          : 500;

      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to process resumes",
      });
    }
  },
};
