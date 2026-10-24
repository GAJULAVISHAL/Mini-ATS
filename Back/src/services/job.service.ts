
import { jobRepository } from "../repositories/job.repository.js";
import type { CreateJobInput } from "../validators/job.validator.js";

export const jobService = {
  createJob(input: CreateJobInput) {
    return jobRepository.create(input);
  },

  getJobs() {
    return jobRepository.findAll();
  },

  async getJobById(id: string) {
    return jobRepository.findById(id);
  },
};
