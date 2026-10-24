import { prisma } from "../lib/db";

export const candidateRepository = {
  create() {
    return prisma.candidate.create({
      data: {},
    });
  },

  updateContact(
    id: string,
    data: {
      email: string | null;
      phone: string | null;
    },
  ) {
    return prisma.candidate.update({
      where: { id },
      data,
    });
  },
};