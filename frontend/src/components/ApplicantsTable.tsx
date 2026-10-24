
import type { Application } from "../types";

type ApplicantsTableProps = {
  applications: Application[];
  loading: boolean;
  generatingId: string | null;
  onGenerateScore: (applicationId: string) => void;
};

export default function ApplicantsTable({
  applications,
  loading,
  generatingId,
  onGenerateScore,
}: ApplicantsTableProps) {
  if (loading) {
    return <p className="text-slate-500">Loading applicants...</p>;
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
        No applicants found for this job.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-212.5 text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
          <tr>
            <th className="px-5 py-4 font-medium">Candidate</th>
            <th className="px-5 py-4 font-medium">Resume</th>
            <th className="px-5 py-4 font-medium">Processing</th>
            <th className="px-5 py-4 font-medium">Application</th>
            <th className="px-5 py-4 font-medium">Match Score</th>
            <th className="px-5 py-4 font-medium">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {applications.map((application) => (
            <tr key={application.id} className="hover:bg-slate-50">
              <td className="px-5 py-4">
                <p className="font-medium">
                  {application.candidate.name || "Unnamed candidate"}
                </p>
                <p className="mt-1 text-slate-500">
                  {application.candidate.email || "No email"}
                </p>
              </td>

              <td className="max-w-48 px-5 py-4">
                <p className="wrap-break-word">
                  {application.resume.originalFileName}
                </p>
              </td>

              <td className="px-5 py-4">
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

              <td className="px-5 py-4">{application.status}</td>

              <td className="px-5 py-4">
                {application.matchReport ? (
                  <span className="font-semibold text-indigo-700">
                    {application.matchReport.overallScore.toFixed(1)}%
                  </span>
                ) : (
                  <span className="text-slate-400">Not generated</span>
                )}
              </td>

              <td className="px-5 py-4">
                {application.matchReport ? (
                  <span className="text-xs font-medium text-emerald-700">
                    Scored
                  </span>
                ) : (
                  <button
                    onClick={() => onGenerateScore(application.id)}
                    disabled={
                      generatingId !== null ||
                      application.resume.processingStatus !== "COMPLETED"
                    }
                    className="whitespace-nowrap rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}
