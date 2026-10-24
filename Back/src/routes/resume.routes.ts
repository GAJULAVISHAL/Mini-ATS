
import { Router } from "express";
import multer from "multer";
import { resumeController } from "../controllers/resume.controller.js";

const resumeRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 20,
  },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      callback(new Error("Only PDF and DOCX files are allowed"));
      return;
    }

    callback(null, true);
  },
});

resumeRouter.post(
  "/:jobId/resumes",
  upload.array("resumes", 20),
  resumeController.upload,
);

export default resumeRouter;
