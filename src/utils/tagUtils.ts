/**
 * Utility functions for handling tags across projects and posts
 */

import { getCollection } from 'astro:content';
import { getSortableDate } from './dateUtils';
import { getEntrySlug, isMainEntry } from './contentUtils';

/**
 * Gets all unique tags from both projects and posts with their counts
 * @returns Array of tag objects with name and count
 */
export async function getAllTags() {
  const [projects, posts] = await Promise.all([
    getCollection('projects'),
    getCollection('posts')
  ]);

  // Filter to only include main project files (index.mdx), not version files
  const mainProjects = projects.filter(isMainEntry);

  const tagCounts = new Map<string, number>();

  // Count tags from projects
  mainProjects.forEach(project => {
    if (!project.data.draft) {
      project.data.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }
  });

  // Count tags from posts
  posts.forEach(post => {
    if (!post.data.draft) {
      post.data.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }
  });

  // Convert to array and sort by count (descending) then alphabetically
  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
}

/**
 * Gets all content (projects and posts) that have a specific tag
 * @param tag - The tag to filter by
 * @returns Object with filtered projects and posts
 */
export async function getContentByTag(tag: string) {
  const [projects, posts] = await Promise.all([
    getCollection('projects'),
    getCollection('posts')
  ]);

  // Filter to only include main project files (index.mdx), not version files
  const mainProjects = projects.filter(isMainEntry);

  const filteredProjects = mainProjects.filter(project => 
    !project.data.draft && project.data.tags.includes(tag)
  );

  const filteredPosts = posts.filter(post => 
    !post.data.draft && post.data.tags.includes(tag)
  );

  return {
    projects: filteredProjects,
    posts: filteredPosts,
    totalCount: filteredProjects.length + filteredPosts.length
  };
}

/**
 * Gets related content based on shared tags
 * @param currentTags - Tags from the current content
 * @param currentSlug - Slug of current content to exclude from results
 * @param limit - Maximum number of related items to return
 * @returns Array of related content with relevance scores
 */
export async function getRelatedContent(
  currentTags: string[], 
  currentSlug: string, 
  limit: number = 3
) {
  const [projects, posts] = await Promise.all([
    getCollection('projects'),
    getCollection('posts')
  ]);

  // Filter to only include main project files (index.mdx), not version files
  const mainProjects = projects.filter(isMainEntry);

  const allContent = [
    ...mainProjects.map((p) => ({
      id: p.id,
      type: 'project' as const,
      slug: getEntrySlug(p),
      data: p.data,
    })),
    ...posts.map((p) => ({
      id: p.id,
      type: 'post' as const,
      slug: getEntrySlug(p),
      data: p.data,
    }))
  ];

  // Calculate relevance scores based on shared tags
  const related = allContent
    .filter(content => 
      !content.data.draft && 
      content.slug !== currentSlug &&
      content.data.tags.some(tag => currentTags.includes(tag))
    )
    .map(content => {
      const sharedTags = content.data.tags.filter(tag => currentTags.includes(tag));
      const relevanceScore = sharedTags.length;
      return {
        type: content.type,
        slug: content.slug,
        data: content.data,
        relevanceScore,
        sharedTags,
      };
    })
    .sort((a, b) => {
      // Sort by relevance score first, then by date
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      // Handle different date structures for projects vs posts
      const aDate = a.type === 'project' 
        ? (a.data.endDate || a.data.startDate)
        : a.data.date;
      const bDate = b.type === 'project' 
        ? (b.data.endDate || b.data.startDate) 
        : b.data.date;
      return getSortableDate(bDate).getTime() - getSortableDate(aDate).getTime();
    })
    .slice(0, limit);

  return related;
}
