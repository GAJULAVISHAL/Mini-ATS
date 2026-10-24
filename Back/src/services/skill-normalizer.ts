
const SKILL_ALIASES: Record<string, string[]> = {
  JavaScript: ["js", "javascript"],
  TypeScript: ["ts", "typescript"],
  "Node.js": ["node", "nodejs", "node.js"],
  "React.js": ["react", "reactjs", "react.js"],
  "Next.js": ["next", "nextjs", "next.js"],
  "Express.js": ["express", "expressjs", "express.js"],
  PostgreSQL: ["postgres", "postgresql", "psql"],
  MongoDB: ["mongo", "mongodb"],
  "C++": ["cpp", "c++"],
  "C#": ["csharp", "c#"],
  "REST API": ["rest", "rest api", "rest apis"],
  "Machine Learning": ["ml", "machine learning"],
  "Artificial Intelligence": ["ai", "artificial intelligence"],
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getSkillVariants(skill: string): string[] {
  const normalizedSkill = normalizeText(skill);

  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    const variants = [canonical, ...aliases];

    if (
      variants.some(
        (variant) => normalizeText(variant) === normalizedSkill
      )
    ) {
      return variants;
    }
  }

  return [skill];
}

export function normalizeSkill(skill: string): string {
  const normalizedSkill = normalizeText(skill);

  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    const variants = [canonical, ...aliases];

    if (
      variants.some(
        (variant) => normalizeText(variant) === normalizedSkill
      )
    ) {
      return canonical;
    }
  }

  return skill.trim();
}
