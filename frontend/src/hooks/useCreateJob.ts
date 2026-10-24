
import { useState } from "react";
import type { Job } from "../types";

type CreateJobInput = {
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minExperienceYears: number | null;
};

export function useCreateJob() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function createJob(input: CreateJobInput): Promise<Job | null> {
    setCreating(true);
    setError("");

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create job");
      }

      return result.data?.job ?? result.data ?? null;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create job"
      );
      return null;
    } finally {
      setCreating(false);
    }
  }

  return { createJob, creating, error };
}
