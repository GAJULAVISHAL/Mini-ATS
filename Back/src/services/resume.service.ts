
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { jobRepository } from "../repositories/job.repository.js";
import { candidateRepository } from "../repositories/candidate.repository.js";
import { resumeRepository } from "../repositories/resume.repository.js";
import { applicationRepository } from "../repositories/application.repository.js";
import { extractResumeText } from "./resume-parser.js";

export interface ResumeUpload {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

const uploadDirectory = resolve(process.cwd(), "uploads");

function extractEmail(text: string): string | null {
  return text.match(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  )?.[0] ?? null;
}

function extractPhone(text: string): string | null {
  return text.match(
    /(?:\+?\d[\d\s().-]{7,}\d)/,
  )?.[0]?.trim() ?? null;
}

export const resumeService = {
  async uploadBatch(jobId: string, files: ResumeUpload[]) {
    const job = await jobRepository.findById(jobId);

    if (!job) {
      throw Object.assign(new Error("Job not found"), {
        statusCode: 404,
      });
    }

    if (job.status !== "ACTIVE") {
      throw Object.assign(
        new Error("Cannot upload resumes to a closed job"),
        { statusCode: 409 },
      );
    }

    if (!job) {
      throw Object.assign(new Error("Job not found"), {
        statusCode: 404,
      });
    }

    if (job.status !== "ACTIVE") {
      throw Object.assign(
        new Error("Cannot upload resumes to a closed job"),
        { statusCode: 409 },
      );
    }

    await mkdir(uploadDirectory, { recursive: true });

    const results = [];

    for (const file of files) {
      results.push(await this.processOne(job.id, file));
    }

    return {
      total: files.length,
      processed: results.filter((item) => item.success).length,
      failed: results.filter((item) => !item.success).length,
      results,
    };
  },

  async processOne(jobId: string, file: ResumeUpload) {
    const extension =
      file.mimetype === "application/pdf" ? ".pdf" : ".docx";

    const storedFileName = `${randomUUID()}${extension}`;
    const absolutePath = resolve(uploadDirectory, storedFileName);
    const storagePath = `uploads/${storedFileName}`;

    try {
      await writeFile(absolutePath, file.buffer);

      const candidate = await candidateRepository.create();
      const candidateId = candidate.id;

      const resume = await resumeRepository.create({
        candidateId,
        originalFileName: file.originalname,
        storedFileName,
        mimeType: file.mimetype,
        fileSize: file.size,
        storagePath,
      });
      const resumeId = resume.id;

      let processingError: string | null = null;
      let extractedText: string | undefined;

      try {
        extractedText = await extractResumeText(
          file.buffer,
          file.mimetype,
        );

        await candidateRepository.updateContact(candidateId, {
          email: extractEmail(extractedText),
          phone: extractPhone(extractedText),
        });

        await resumeRepository.updateProcessing(resumeId, {
          extractedText,
          processingStatus: "COMPLETED",
          processingError: null,
        });
      } catch (error) {
        processingError =
          error instanceof Error
            ? error.message
            : "Resume processing failed";

        await resumeRepository.updateProcessing(resumeId, {
          processingStatus: "FAILED",
          processingError,
        });
      }

      const application = await applicationRepository.create({
        jobId,
        candidateId,
        resumeId,
        status: processingError ? "NEEDS_REVIEW" : "APPLIED",
      });

      return {
        originalFileName: file.originalname,
        success: !processingError,
        processingStatus: processingError ? "FAILED" : "COMPLETED",
        applicationId: application.id,
        ...(processingError
          ? { error: processingError }
          : { extractedCharacters: extractedText?.length ?? 0 }),
      };
    } catch (error) {
      console.error(`Failed to register ${file.originalname}:`, error);

      return {
        originalFileName: file.originalname,
        success: false,
        error: "Failed to save or register this resume",
      };
    }
  },
};
