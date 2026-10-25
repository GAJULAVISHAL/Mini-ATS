
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
      <section className="hero">
        <div>
          <div className="eyebrow">Recruiting desk / live workspace</div>
          <h2>Find the signal<br />in the stack.</h2>
          <p className="hero-copy">Keep every open role moving, from the first resume to the final yes. Your hiring work, without the spreadsheet fog.</p>
        </div>
        <div className="hero-stat"><strong>{jobs.length}</strong><span>active role{jobs.length === 1 ? "" : "s"} in view</span></div>
      </section>
      <section>
        <div className="section-heading">
          <div><h3>Open roles</h3><p>Choose a role to inspect its candidate pipeline.</p></div>
          <button onClick={onCreateJob} className="primary-button">+ New role</button>
        </div>

      {loading ? (
        <div className="empty-state">Loading roles...</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <strong>No roles yet</strong>
          Create your first opening to start building a pipeline.
          <div><button onClick={onCreateJob} className="primary-button" style={{ marginTop: 20 }}>Create first role</button></div>
        </div>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="job-card"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="mono-label">Role / {job.id.slice(0, 6)}</span>
                <span className="status-pill">
                  {job.status}
                </span>
              </div>

              <h3>
                {job.title}
              </h3>

              <p className="job-card-description">
                {job.description || "No description provided."}
              </p>

              <div className="job-meta">
                <span>
                  Exp /{" "}
                  {job.minExperienceYears == null
                    ? "—"
                    : `${job.minExperienceYears}+ yrs`}
                </span>
                <span>
                  People / {job._count?.applications ?? 0}
                </span>
              </div>

              <div className="skill-row">
                {job.requiredSkills?.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="skill-chip"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="card-link">
                Open pipeline →
              </p>
            </button>
          ))}
        </div>
      )}
      </section>
    </>
  );
}
