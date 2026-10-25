
import { jobRepository } from "../repositories/job.repository.js";
import { applicationRepository } from "../repositories/application.repository.js";

const allowedStatuses = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
  "NEEDS_REVIEW",
] as const;

type ApplicationStatus = (typeof allowedStatuses)[number];

export const applicationService = {
  async getApplicationsByJobId(jobId: string) {
    const job = await jobRepository.findById(jobId);

    if (!job) {
      const error = new Error("Job not found") as Error & {
        statusCode: number;
      };

      error.statusCode = 404;
      throw error;
    }

    const applications =
      await applicationRepository.findByJobId(jobId);

    return {
      job: {
        id: job.id,
        title: job.title,
      },
      totalApplications: applications.length,
      applications,
    };
  },
  async updateStatus(applicationId: string, status: unknown) {
    if (!applicationId) {
      throw new Error("Application ID is required");
    }

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status as ApplicationStatus)
    ) {
      throw new Error("Invalid application status");
    }

    try {
      return await applicationRepository.updateStatus(
        applicationId,
        status as ApplicationStatus
      );
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2025"
      ) {
        const notFoundError = new Error("Application not found");
        Object.assign(notFoundError, { statusCode: 404 });
        throw notFoundError;
      }

      throw error;
    }
  },
};
