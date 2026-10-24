
import type { Job } from "../types";

type JobsDashboardProps = {
  jobs: Job[];
  loading: boolean;
  onSelectJob: (job: Job) => void;
  onCreateJob: () => void;
};

export default function JobsDashboard({
  jobs,
  loading,
  onSelectJob,
  onCreateJob,
}: JobsDashboardProps) {
  return (
    <>
      <section className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Jobs Dashboard</h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage multiple job openings and their applicants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3">
            <p className="text-sm text-slate-500">Total Jobs</p>
            <p className="mt-1 text-2xl font-bold">{jobs.length}</p>
          </div>

          <button
            onClick={onCreateJob}
            className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Create Job
          </button>
        </div>
      </section>

      {loading ? (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
          Loading jobs...
        </p>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h3 className="text-lg font-semibold">No jobs found</h3>
          <p className="mt-2 text-sm text-slate-500">
            Create your first job opening to get started.
          </p>
          <button
            onClick={onCreateJob}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Create Your First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  {job.status}
                </span>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                {job.description || "No description provided."}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                <span>
                  Experience:{" "}
                  {job.minExperienceYears == null
                    ? "Not specified"
                    : `${job.minExperienceYears}+ years`}
                </span>
                <span>
                  Applicants: {job._count?.applications ?? 0}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.requiredSkills?.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-sm font-semibold text-indigo-600">
                View Applicants →
              </p>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
