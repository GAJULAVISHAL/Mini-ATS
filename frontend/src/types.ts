export type Job = {
  id: string;
  title: string;
  description: string;
  status: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  minExperienceYears: number | null;
  createdAt?: string;
  _count?: {
    applications: number;
  };
};

export type Candidate = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
};

export type Resume = {
  id: string;
  originalFileName: string;
  processingStatus: string;
  processingError?: string | null;
};

export type MatchReportData = {
  overallScore: number;
  summary: string;
  matchedRequirements?: string[];
  missingRequirements?: string[];
  requirementEvidence?: {
    requirement: string;
    matched: boolean;
    evidence: string | null;
  }[];
};

export type Application = {
  id: string;
  status: string;
  candidate: Candidate;
  resume: Resume;
  matchReport: MatchReportData | null;
};

export type Ranking = Application & {
  rank: number;
};
