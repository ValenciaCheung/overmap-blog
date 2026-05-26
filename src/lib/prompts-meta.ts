export interface PromptFrontmatter {
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags?: string[];
  model?: string;
  author?: string;
  date?: string;
}

export interface PromptItem extends PromptFrontmatter {
  slug: string;
  body: string;
}
