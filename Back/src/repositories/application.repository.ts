
import { prisma } from "../lib/db";

export const applicationRepository = {
  
  create(data: {
    jobId: string;
    candidateId: string;
    resumeId: string;
    status: "APPLIED" | "NEEDS_REVIEW";
  }) {
    return prisma.application.create({ data });
  },

  findByJobId(jobId: string) {
    return prisma.application.findMany({
      where: { jobId },
      orderBy: { createdAt: "desc" },

      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },

        resume: {
          select: {
            id: true,
            originalFileName: true,
            processingStatus: true,
            processingError: true,
            uploadedAt: true,
          },
        },

        matchReport: true,
      },
    });
  },
};
