
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
    <section className="panel data-panel">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">Candidate rankings</h3>
          <p className="panel-subtitle">
            A quick read on who is closest to the brief
          </p>
        </div>

        <div className="flex gap-2">
          {!visible && (
            <button
              onClick={onLoad}
              disabled={loading}
              className="primary-button"
            >
              {loading ? "Loading..." : "Rank Candidates"}
            </button>
          )}

          {visible && (
            <button
              onClick={onHide}
              className="quiet-button"
            >
              Hide
            </button>
          )}
        </div>
      </div>

      {visible && (
        loading ? (
          <p className="empty-state">
            Loading rankings...
          </p>
        ) : rankings.length === 0 ? (
          <p className="empty-state">
            No candidates found.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th><th>Candidate</th><th>Match Score</th><th>Application Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rankings.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      #{candidate.rank}
                    </td>
                    <td>
                      <p className="candidate-name">
                        {candidate.candidate.name || "Unnamed candidate"}
                      </p>
                      <p className="candidate-sub">
                        {candidate.candidate.email || "No email"}
                      </p>
                    </td>
                    <td>
                      {candidate.matchReport ? (
                        <span className="score">
                          {candidate.matchReport.overallScore.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="muted">Not scored</span>
                      )}
                    </td>
                    <td className="mono-label">{candidate.status}</td>
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
