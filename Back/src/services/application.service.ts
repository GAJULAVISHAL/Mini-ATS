
import { jobRepository } from "../repositories/job.repository.js";
import { applicationRepository } from "../repositories/application.repository.js";

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
};
