
import { useState } from "react";

import Header from "./components/Header";
import JobsDashboard from "./components/JobsDashboard";
import ResumeUpload from "./components/ResumeUpload";
import ApplicantsTable from "./components/ApplicantsTable";
import CandidateRankings from "./components/CandidateRankings";
import CreateJobForm from "./components/CreateJobForm";
import { useCreateJob } from "./hooks/useCreateJob";
import { useJobs } from "./hooks/useJobs";
import { useApplications } from "./hooks/useApplications";
import { useRankings } from "./hooks/useRankings";
import { useResumeUpload } from "./hooks/useResumeUpload";
import HiringPipeline from "./components/HiringPipeline";

import type { Job } from "./types";

function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showRankings, setShowRankings] = useState(false);

  const jobsState = useJobs();
  const applicationsState = useApplications();
  const rankingsState = useRankings();
  const uploadState = useResumeUpload();

  const [showCreateJob, setShowCreateJob] = useState(false);
  const createJobState = useCreateJob();

  const error =
    jobsState.error ||
    applicationsState.error ||
    rankingsState.error ||
    uploadState.error;

  async function openJob(job: Job) {
    setSelectedJob(job);
    setShowRankings(false);

    await applicationsState.fetchApplications(job.id);
  }

  async function handleUpload(file: File) {
    if (!selectedJob) return;

    const success = await uploadState.uploadResume(selectedJob.id, file);

    if (success) {
      await applicationsState.fetchApplications(selectedJob.id);
    }
  }

  async function handleGenerateScore(applicationId: string) {
    if (!selectedJob) return;

    const success = await applicationsState.generateReport(
      applicationId,
      selectedJob.id
    );

    if (success && showRankings) {
      await rankingsState.fetchRankings(selectedJob.id);
    }
  }

  async function handleLoadRankings() {
    if (!selectedJob) return;

    const success = await rankingsState.fetchRankings(selectedJob.id);

    if (success) {
      setShowRankings(true);
    }
  }

  function goBackToJobs() {
    setSelectedJob(null);
    setShowRankings(false);
  }

  async function handleCreateJob(
    input: Parameters<typeof createJobState.createJob>[0]
  ): Promise<boolean> {
    const createdJob = await createJobState.createJob(input);

    if (!createdJob) return false;

    await jobsState.fetchJobs();
    setShowCreateJob(false);
    return true;
  }

  return (
    <div className="app-shell">
      <Header
        onBack={selectedJob ? goBackToJobs : undefined}
        onRefresh={
          !selectedJob ? () => void jobsState.fetchJobs() : undefined
        }
        loading={jobsState.loading}
      />

      <main className="page">
        {error && (
          <div className="notice">
            <p>{error}</p>
            <button
              onClick={() => {
                // Errors are cleared when the corresponding request is retried.
                void jobsState.fetchJobs();
              }}
              className="quiet-button"
            >
              Retry jobs request
            </button>
          </div>
        )}

        {!selectedJob ? (
          <>
            {showCreateJob ? (
              <CreateJobForm
                creating={createJobState.creating}
                error={createJobState.error}
                onCreate={handleCreateJob}
                onCancel={() => setShowCreateJob(false)}
              />
            ) : null}

            <JobsDashboard
              jobs={jobsState.jobs}
              loading={jobsState.loading}
              onSelectJob={(job) => void openJob(job)}
              onCreateJob={() => setShowCreateJob(true)}
            />
          </>
        ) : (
          <>
            <section>
              <button
                onClick={goBackToJobs}
                className="back-link"
              >
                ← All roles
              </button>

              <h2 className="detail-title">
                {selectedJob.title}
              </h2>

              <p className="detail-meta">
                {applicationsState.applications.length} people in this pipeline
              </p>
            </section>

            <HiringPipeline applications={applicationsState.applications} />

            {/* Resume upload section */}
            <ResumeUpload
              onUpload={handleUpload}
              uploading={uploadState.uploading}
              message={uploadState.error || uploadState.message}
            />

            <CandidateRankings
              rankings={rankingsState.rankings}
              loading={rankingsState.loading}
              visible={showRankings}
              onLoad={() => void handleLoadRankings()}
              onHide={() => setShowRankings(false)}
            />

            <ApplicantsTable
              applications={applicationsState.applications}
              loading={applicationsState.loading}
              generatingId={applicationsState.generatingId}
              updatingId={applicationsState.updatingId}
              onGenerateScore={(id) => void handleGenerateScore(id)}
              onUpdateStatus={(applicationId, status) => {
                if (!selectedJob) return;

                void applicationsState.updateStatus(
                  applicationId,
                  selectedJob.id,
                  status
                );
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
