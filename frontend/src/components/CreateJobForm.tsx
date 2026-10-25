
import { useState } from "react";

type CreateJobInput = {
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minExperienceYears: number | null;
};

type Props = {
  creating: boolean;
  error: string;
  onCreate: (input: CreateJobInput) => Promise<boolean>;
  onCancel: () => void;
};

export default function CreateJobForm({
  creating,
  error,
  onCreate,
  onCancel,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [preferredSkills, setPreferredSkills] = useState("");
  const [experience, setExperience] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const success = await onCreate({
      title: title.trim(),
      description: description.trim(),
      requiredSkills: requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      preferredSkills: preferredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      minExperienceYears:
        experience === "" ? null : Number(experience),
    });

    if (success) {
      setTitle("");
      setDescription("");
      setRequiredSkills("");
      setPreferredSkills("");
      setExperience("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="panel form-panel"
    >
      <div className="section-heading">
        <div><h3>Open a new role</h3><p>Give the hiring desk enough signal to start matching.</p></div>
      </div>

      <div className="form-grid">
      <div className="form-field">
        <label>Job title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Full Stack Developer"
          className="input"
        />
      </div>

      <div className="form-field full">
        <label>
          Job description
        </label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the role and responsibilities..."
          className="textarea"
        />
      </div>

      <div className="form-field">
        <label>
          Required skills
        </label>
        <input
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
          placeholder="React, TypeScript, Node.js"
          className="input"
        />
        <p className="form-help">
          Separate skills with commas.
        </p>
      </div>

      <div className="form-field">
        <label>
          Preferred skills
        </label>
        <input
          value={preferredSkills}
          onChange={(e) => setPreferredSkills(e.target.value)}
          placeholder="Docker, AWS, PostgreSQL"
          className="input"
        />
      </div>

      <div className="form-field">
        <label>
          Minimum experience (years)
        </label>
        <input
          type="number"
          min="0"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="e.g. 2"
          className="input"
        />
      </div>

      </div>
      {error && <p className="notice">{error}</p>}

      <div className="form-actions">
        <button
          type="submit"
          disabled={creating}
          className="primary-button"
        >
          {creating ? "Creating..." : "Create Job"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="secondary-button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
