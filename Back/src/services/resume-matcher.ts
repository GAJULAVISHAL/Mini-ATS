import { getSkillVariants, normalizeSkill } from "./skill-normalizer.js";
import type {
  RequirementEvidence,
  ResumeMatchResult,
} from "../types/match.types.js";

type MatchJobInput = {
  requiredSkills: string[];
  preferredSkills: string[];
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findEvidence(
  resumeText: string,
  skill: string
): string | null {
  const variants = getSkillVariants(skill);

  for (const variant of variants) {
    const escapedVariant = escapeRegex(variant.trim())
      .replace(/\s+/g, "\\s+");

    if (!escapedVariant) continue;

    const pattern = new RegExp(
      `(?<![a-z0-9])${escapedVariant}(?![a-z0-9])`,
      "i"
    );

    const match = pattern.exec(resumeText);

    if (!match || match.index === undefined) continue;

    const start = Math.max(0, match.index - 60);
    const end = Math.min(
      resumeText.length,
      match.index + match[0].length + 100
    );

    return resumeText
      .slice(start, end)
      .replace(/\s+/g, " ")
      .trim();
  }

  return null;
}


export function matchResumeToJob(
  resumeText: string,
  job: MatchJobInput
): ResumeMatchResult {
  const requiredSkills = [
    ...new Set(
      job.requiredSkills
        .map(normalizeSkill)
        .filter(Boolean)
        .map((skill) => skill.trim())
    ),
  ];

  const preferredSkills = [
    ...new Set(
      job.preferredSkills
        .map(normalizeSkill)
        .filter(Boolean)
        .map((skill) => skill.trim())
    ),
  ].filter(
    (skill) =>
      !requiredSkills.some(
        (required) =>
          required.toLowerCase() === skill.toLowerCase()
      )
  );

  const requirements: RequirementEvidence[] = [
    ...requiredSkills.map((requirement) => {
      const evidence = findEvidence(resumeText, requirement);

      return {
        requirement,
        matched: evidence !== null,
        evidence,
      };
    }),
    ...preferredSkills.map((requirement) => {
      const evidence = findEvidence(resumeText, requirement);

      return {
        requirement,
        matched: evidence !== null,
        evidence,
      };
    }),
  ];

  const matchedRequirements = requirements
    .filter((item) => item.matched)
    .map((item) => item.requirement);

  const missingRequirements = requirements
    .filter((item) => !item.matched)
    .map((item) => item.requirement);

  // Required skills carry four times the weight of preferred skills.
  const totalWeight =
    requiredSkills.length * 4 + preferredSkills.length;

  const matchedWeight = requirements.reduce((total, item) => {
    if (!item.matched) return total;

    const isRequired = requiredSkills.some(
      (skill) =>
        skill.toLowerCase() === item.requirement.toLowerCase()
    );

    return total + (isRequired ? 4 : 1);
  }, 0);

  const overallScore =
    totalWeight === 0
      ? 0
      : Math.round((matchedWeight / totalWeight) * 100);

  const summary =
    totalWeight === 0
      ? "No required or preferred skills were provided for comparison."
      : `Matched ${matchedRequirements.length} of ${requirements.length} listed skills.`;

  return {
    overallScore,
    summary,
    matchedRequirements,
    missingRequirements,
    requirementEvidence: requirements,
  };
}
