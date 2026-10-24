
export type RequirementEvidence = {
  requirement: string;
  matched: boolean;
  evidence: string | null;
};

export type ResumeMatchResult = {
  overallScore: number;
  summary: string;
  matchedRequirements: string[];
  missingRequirements: string[];
  requirementEvidence: RequirementEvidence[];
};
