
import type { Application, ApplicationStatus } from "../types";

type HiringPipelineProps = {
    applications: Application[];
};

const stages: {
    status: ApplicationStatus;
    label: string;
}[] = [
        { status: "APPLIED", label: "Applied" },
        { status: "SHORTLISTED", label: "Shortlisted" },
        { status: "INTERVIEW", label: "Interview" },
        { status: "SELECTED", label: "Selected" },
        { status: "REJECTED", label: "Rejected" },
        { status: "NEEDS_REVIEW", label: "Needs Review" },
    ];

export default function HiringPipeline({
    applications,
}: HiringPipelineProps) {
    return (
        <section className="pipeline">
            <div className="section-heading">
                <div>
                <h3>
                    Hiring Pipeline
                </h3>
                <p>
                    Where candidates are sitting right now
                </p>
                </div>
            </div>

            <div className="pipeline-grid">
                {stages.map((stage) => {
                    const count =
                        stage.status === "APPLIED"
                            ? applications.length
                            : applications.filter(
                                (application) => application.status === stage.status
                            ).length;

                    return (
                        <div
                            key={stage.status}
                            className="stage-card"
                        >
                            <div className="stage-top">
                                <span className="stage-dot" />
                                <p>{stage.label}</p>
                            </div>

                            <p className="stage-count">
                                {count}
                            </p>
                            <p className="stage-label">
                                {count === 1 ? "candidate" : "candidates"}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}