import { prisma } from "../lib/db.js";
import { applicationRepository } from "../repositories/application.repository.js";

export const rankingService = {
  async getRankings(jobId: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        title: true,
      },
    });

    if (!job) {
      const error = new Error("Job not found") as Error & {
        statusCode: number;
      };

      error.statusCode = 404;
      throw error;
    }

    const applications =
      await applicationRepository.findByJobId(jobId);

    const rankedApplications = [...applications].sort(
      (a, b) => {
        const scoreA = a.matchReport?.overallScore ?? -1;
        const scoreB = b.matchReport?.overallScore ?? -1;

        return scoreB - scoreA;
      }
    );

    return {
      job,
      totalApplications: rankedApplications.length,
      rankedCandidates: rankedApplications.map(
        (application, index) => ({
          rank: index + 1,
          ...application,
        })
      ),
    };
  },
};
