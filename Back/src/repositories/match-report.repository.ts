
import { prisma } from "../lib/db.js";
import type { ResumeMatchResult } from "../types/match.types.js";

export const matchReportRepository = {
  upsertForApplication(
    applicationId: string,
    result: ResumeMatchResult
  ) {
    const data = {
      overallScore: result.overallScore,
      summary: result.summary,
      matchedRequirements: result.matchedRequirements,
      missingRequirements: result.missingRequirements,
      requirementEvidence: result.requirementEvidence,
    };

    return prisma.matchReport.upsert({
      where: { applicationId },
      create: {
        applicationId,
        ...data,
      },
      update: data,
    });
  },
};
