export interface SkillItem {
  slug: string;
  name: string;
  description: string;
  body: string;
  bodyBytes: number;
  githubUrl: string;
  rawUrl: string;
  directoryUrl: string;
  syncedAt: string;
}

export const SKILLS_REPO = "anthropics/skills";
export const SKILLS_REPO_URL = `https://github.com/${SKILLS_REPO}`;
