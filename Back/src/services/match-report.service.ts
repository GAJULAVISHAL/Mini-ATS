
import { prisma } from "../lib/db.js";
import { matchResumeToJob } from "./resume-matcher.js";
import { matchReportRepository } from "../repositories/match-report.repository.js";

export const matchReportService = {
  async generateForApplication(applicationId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
        resume: true,
      },
    });

    if (!application) {
      const error = new Error("Application not found") as Error & {
        statusCode: number;
      };
      error.statusCode = 404;
      throw error;
    }

    if (application.resume.processingStatus !== "COMPLETED") {
      const error = new Error(
        "Resume processing is not completed"
      ) as Error & { statusCode: number };

      error.statusCode = 409;
      throw error;
    }

    const resumeText = application.resume.extractedText;

    if (!resumeText?.trim()) {
      const error = new Error(
        "Extracted resume text is unavailable"
      ) as Error & { statusCode: number };

      error.statusCode = 422;
      throw error;
    }

    const result = matchResumeToJob(resumeText, {
      requiredSkills: application.job.requiredSkills,
      preferredSkills: application.job.preferredSkills,
    });

    const matchReport =
      await matchReportRepository.upsertForApplication(
        application.id,
        result
      );

    return {
      applicationId: application.id,
      jobTitle: application.job.title,
      resumeFileName: application.resume.originalFileName,
      matchReport,
    };
  },
};
