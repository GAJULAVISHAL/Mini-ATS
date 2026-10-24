
import type { Ranking } from "../types";

type CandidateRankingsProps = {
  rankings: Ranking[];
  loading: boolean;
  visible: boolean;
  onLoad: () => void;
  onHide: () => void;
};

export default function CandidateRankings({
  rankings,
  loading,
  visible,
  onLoad,
  onHide,
}: CandidateRankingsProps) {
  return (
    <section className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="text-lg font-semibold">Candidate Rankings</h3>
          <p className="mt-1 text-sm text-slate-500">
            Candidates ordered by match score
          </p>
        </div>

        <div className="flex gap-2">
          {!visible && (
            <button
              onClick={onLoad}
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Rank Candidates"}
            </button>
          )}

          {visible && (
            <button
              onClick={onHide}
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              Hide
            </button>
          )}
        </div>
      </div>

      {visible && (
        loading ? (
          <p className="p-5 text-sm text-slate-500">
            Loading rankings...
          </p>
        ) : rankings.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">
            No candidates found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-162.5 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Rank</th>
                  <th className="px-5 py-3 font-medium">Candidate</th>
                  <th className="px-5 py-3 font-medium">Match Score</th>
                  <th className="px-5 py-3 font-medium">Application Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rankings.map((candidate) => (
                  <tr key={candidate.id}>
                    <td className="px-5 py-4 font-semibold">
                      #{candidate.rank}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {candidate.candidate.name || "Unnamed candidate"}
                      </p>
                      <p className="mt-1 text-slate-500">
                        {candidate.candidate.email || "No email"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {candidate.matchReport ? (
                        <span className="font-semibold text-indigo-700">
                          {candidate.matchReport.overallScore.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-400">Not scored</span>
                      )}
                    </td>
                    <td className="px-5 py-4">{candidate.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </section>
  );
}
