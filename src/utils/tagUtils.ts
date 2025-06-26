/**
 * Utility functions for handling tags across projects and posts
 */

import { getCollection } from 'astro:content';
import { getSortableDate } from './dateUtils';

/**
 * Gets all unique tags from both projects and posts with their counts
 * @returns Array of tag objects with name and count
 */
export async function getAllTags() {
  const [projects, posts] = await Promise.all([
    getCollection('projects'),
    getCollection('posts')
  ]);

  const tagCounts = new Map<string, number>();

  // Count tags from projects
  projects.forEach(project => {
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

  const filteredProjects = projects.filter(project => 
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

  const allContent = [
    ...projects.map(p => ({ ...p, type: 'project' as const })),
    ...posts.map(p => ({ ...p, type: 'post' as const }))
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
      return { ...content, relevanceScore, sharedTags };
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
