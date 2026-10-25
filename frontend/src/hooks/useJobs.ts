
import { useCallback, useEffect, useState } from "react";
import type { Job } from "../types";
import { apiUrl } from "../lib/api";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl("/api/jobs"));

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Expected JSON but received HTML/text. Status: ${response.status}. ${text.slice(0, 100)}`
        );
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load jobs");
      }

      const data = Array.isArray(result.data)
        ? result.data
        : result.data?.jobs;

      if (!Array.isArray(data)) {
        throw new Error("Unexpected jobs API response");
      }

      setJobs(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  return { jobs, loading, error, fetchJobs };
}
