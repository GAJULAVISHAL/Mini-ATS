
import type { Application, ApplicationStatus } from "../types";

type ApplicantsTableProps = {
  applications: Application[];
  loading: boolean;
  generatingId: string | null;
  updatingId: string | null;
  onGenerateScore: (applicationId: string) => void;
  onUpdateStatus: (
    applicationId: string,
    status: ApplicationStatus
  ) => void;
};

const hiringStages: { value: ApplicationStatus; label: string }[] = [
  { value: "APPLIED", label: "Applied" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "SELECTED", label: "Selected" },
  { value: "REJECTED", label: "Rejected" },
  { value: "NEEDS_REVIEW", label: "Needs Review" },
];

function getStageStyle(status: ApplicationStatus) {
  switch (status) {
    case "SHORTLISTED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "INTERVIEW":
      return "bg-violet-50 text-violet-700 border-violet-200";
    case "SELECTED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";
    case "NEEDS_REVIEW":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export default function ApplicantsTable({
  applications,
  loading,
  generatingId,
  updatingId,
  onGenerateScore,
  onUpdateStatus,
}: ApplicantsTableProps) {
  if (loading) {
    return <div className="empty-state">Loading applicants...</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <strong>No candidates in this role</strong>
        Upload a resume above to begin the pipeline.
      </div>
    );
  }

  return (
    <div className="panel data-panel">
      <div className="table-wrap"><table className="data-table">
        <thead>
          <tr>
            <th>Candidate</th><th>Resume</th><th>Processing</th><th>Hiring Stage</th><th>Match Score</th><th>Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {applications.map((application) => (
            <tr key={application.id}>
              <td>
                <p className="candidate-name">
                  {application.candidate.name || "Unnamed candidate"}
                </p>
                <p className="candidate-sub">
                  {application.candidate.email || "No email"}
                </p>
              </td>

              <td>
                <p className="candidate-sub">
                  {application.resume.originalFileName}
                </p>
              </td>

              <td>
                <span
                  className={
                    application.resume.processingStatus === "COMPLETED"
                      ? "text-emerald-700"
                      : application.resume.processingStatus === "FAILED"
                        ? "text-red-600"
                        : "text-amber-600"
                  }
                >
                  {application.resume.processingStatus}
                </span>
              </td>

              <td>
                <select
                  value={application.status}
                  disabled={updatingId !== null}
                  onChange={(event) =>
                    onUpdateStatus(
                      application.id,
                      event.target.value as ApplicationStatus
                    )
                  }
                  aria-label={`Hiring stage for ${
                    application.candidate.name || "candidate"
                  }`}
                  className={`stage-select disabled:cursor-wait disabled:opacity-60 ${getStageStyle(
                    application.status
                  )}`}
                >
                  {hiringStages.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>

                {updatingId === application.id && (
                  <p className="form-help">
                    Updating...
                  </p>
                )}
              </td>

              <td>
                {application.matchReport ? (
                  <span className="score">
                    {application.matchReport.overallScore.toFixed(1)}%
                  </span>
                ) : (
                  <span className="muted">Not generated</span>
                )}
              </td>

              <td>
                {application.matchReport ? (
                  <span className="text-xs font-medium text-emerald-700">
                    Scored
                  </span>
                ) : (
                  <button
                    onClick={() => onGenerateScore(application.id)}
                    disabled={
                      generatingId !== null ||
                      updatingId !== null ||
                      application.resume.processingStatus !== "COMPLETED"
                    }
                    className="primary-button"
                  >
                    {generatingId === application.id
                      ? "Generating..."
                      : "Generate Score"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}