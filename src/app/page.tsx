import { HomeFeed } from "@/components/site/home-feed";
import { getAllPosts } from "@/lib/blog";
import { getAllTools, getFeaturedTools, getTrendingTools } from "@/lib/tools";
import { getAllRepos, getFeaturedRepos } from "@/lib/hub";
import { getAllSkills } from "@/lib/skills";
import { getAllPrompts } from "@/lib/prompts";

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 3);
  const featuredTools = getFeaturedTools(6);
  const trendingTools = getTrendingTools(6);
  const featuredRepos = getFeaturedRepos(3);
  const featuredPrompts = getAllPrompts().slice(0, 4);
  const stats = {
    tools: getAllTools().length,
    skills: getAllSkills().length,
    repos: getAllRepos().length,
    posts: getAllPosts().length,
    prompts: getAllPrompts().length,
  };

  return (
    <HomeFeed
      stats={stats}
      latestPosts={latestPosts}
      featuredTools={featuredTools}
      trendingTools={trendingTools}
      featuredRepos={featuredRepos}
      featuredPrompts={featuredPrompts}
    />
  );
}
