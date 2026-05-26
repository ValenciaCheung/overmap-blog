export interface BlogFrontmatter {
  title: string;
  description?: string;
  date: string;
  cover?: string;
  tags?: string[];
  author?: string;
  video?: string;
  draft?: boolean;
}

export interface BlogPost extends BlogFrontmatter {
  slug: string;
  raw: string;
  readingMinutes: number;
}
