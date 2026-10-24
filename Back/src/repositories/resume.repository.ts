import { prisma } from "../lib/db";

export const resumeRepository = {
  create(data: {
    candidateId: string;
    originalFileName: string;
    storedFileName: string;
    mimeType: string;
    fileSize: number;
    storagePath: string;
  }) {
    return prisma.resume.create({
      data: {
        ...data,
        processingStatus: "PROCESSING",
      },
    });
  },

  updateProcessing(
    id: string,
    data: {
      extractedText?: string;
      processingStatus: "COMPLETED" | "FAILED";
      processingError: string | null;
    },
  ) {
    return prisma.resume.update({
      where: { id },
      data,
    });
  },
};