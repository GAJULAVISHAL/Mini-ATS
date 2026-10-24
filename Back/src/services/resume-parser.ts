
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function extractResumeText(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  let text: string;

  if (mimeType === "application/pdf") {
    const parser = new PDFParse({ data: buffer });

    try {
      const result = await parser.getText();
      text = result.text;
    } finally {
      await parser.destroy();
    }
  } else if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else {
    throw new Error("Unsupported resume format");
  }

  const normalizedText = text.trim();

  if (!normalizedText) {
    throw new Error(
      "No readable text found. The document may be scanned or empty."
    );
  }

  return normalizedText;
}
