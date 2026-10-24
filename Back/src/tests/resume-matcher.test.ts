
// @ts-expect-error Bun provides the test module at runtime.
import { describe, expect, test } from "bun:test";
import { matchResumeToJob } from "../services/resume-matcher.js";

describe("skill normalization", () => {
  test("matches JavaScript when the resume says JS", () => {
    const result = matchResumeToJob(
      "Built frontend applications using JS.",
      {
        requiredSkills: ["JavaScript"],
        preferredSkills: [],
      }
    );

    expect(result.matchedRequirements).toContain("JavaScript");
    expect(result.overallScore).toBe(100);
    expect(result.requirementEvidence[0]?.evidence).toContain("JS");
  });

  test("matches React.js when the resume says React", () => {
    const result = matchResumeToJob(
      "Developed UI components using React.",
      {
        requiredSkills: ["React.js"],
        preferredSkills: [],
      }
    );

    expect(result.matchedRequirements).toContain("React.js");
    expect(result.overallScore).toBe(100);
  });

  test("does not match JavaScript inside an unrelated word", () => {
    const result = matchResumeToJob(
      "Worked on general reactivity improvements.",
      {
        requiredSkills: ["JavaScript"],
        preferredSkills: [],
      }
    );

    expect(result.missingRequirements).toContain("JavaScript");
    expect(result.overallScore).toBe(0);
  });
});