
import { useCallback, useState } from "react";
import type { Ranking } from "../types";
import { apiUrl } from "../lib/api";

export function useRankings() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRankings = useCallback(async (jobId: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl(`/api/jobs/${jobId}/rankings`));
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load rankings");
      }

      const data = result.data?.rankedCandidates;

      if (!Array.isArray(data)) {
        throw new Error("Unexpected rankings API response");
      }

      setRankings(data);
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load rankings"
      );
      setRankings([]);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { rankings, loading, error, fetchRankings };
}
