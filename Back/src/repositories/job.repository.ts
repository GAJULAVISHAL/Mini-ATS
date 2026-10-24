
import { prisma } from "../lib/db.js";
import type { CreateJobInput } from "../validators/job.validator.js";

export const jobRepository = {
  create(data: CreateJobInput) {
    return prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        requiredSkills: data.requiredSkills,
        preferredSkills: data.preferredSkills,
        minExperienceYears: data.minExperienceYears ?? null,
      },
    });
  },

  findAll() {
    return prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });
  },

  findById(id: string) {
    return prisma.job.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });
  },
};
