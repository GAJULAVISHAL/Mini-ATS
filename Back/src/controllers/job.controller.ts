
import type { Request, Response } from "express";
import { ZodError } from "zod";
import { jobService } from "../services/job.service.js";
import { createJobSchema } from "../validators/job.validator.js";

export const jobController = {
  async create(req: Request, res: Response) {
    try {
      const input = createJobSchema.parse(req.body);
      const job = await jobService.createJob(input);

      res.status(201).json({
        success: true,
        data: job,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid job data",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
        return;
      }

      console.error("Create job failed:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create job",
      });
    }
  },

  async findAll(_req: Request, res: Response) {
    try {
      const jobs = await jobService.getJobs();

      res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      console.error("List jobs failed:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch jobs",
      });
    }
  },

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (typeof id !== "string" || !id) {
        res.status(400).json({
          success: false,
          message: "Job ID is required",
        });
        return;
      }

      const job = await jobService.getJobById(id);

      if (!job) {
        res.status(404).json({
          success: false,
          message: "Job not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error) {
      console.error("Fetch job failed:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch job",
      });
    }
  },
};
