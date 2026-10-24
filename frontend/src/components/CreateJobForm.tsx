
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
      className="mb-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6"
    >
      <div>
        <h3 className="text-lg font-semibold">Create Job Opening</h3>
        <p className="mt-1 text-sm text-slate-500">
          Add a new position to your recruitment dashboard.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Job title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Full Stack Developer"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Job description
        </label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the role and responsibilities..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Required skills
        </label>
        <input
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
          placeholder="React, TypeScript, Node.js"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        <p className="mt-1 text-xs text-slate-500">
          Separate skills with commas.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Preferred skills
        </label>
        <input
          value={preferredSkills}
          onChange={(e) => setPreferredSkills(e.target.value)}
          placeholder="Docker, AWS, PostgreSQL"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Minimum experience (years)
        </label>
        <input
          type="number"
          min="0"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="e.g. 2"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={creating}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create Job"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
