// src/content/config.ts
import { defineCollection, z } from "astro:content";

const slug = z.string().regex(/^[a-z0-9-]+$/);

/**
 * Content collections schema for the portfolio site.
 * 
 * Projects support flexible versioned development:
 * - Core fields: version, title, description, startDate, status
 * - Optional enhancements: content (markdown), achievements, learnings, githubUrl
 * - Supports minimal versions (just basic info) or rich documentation
 * - Markdown content is rendered with prose styling when provided
 * - versionsTitle: customize or hide the versions section header
 *   - undefined/null: shows "Project Versions" (default)
 *   - custom string: shows your custom title
 *   - empty string "": hides the header completely
 */
export const collections = {
  posts: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string().max(160),
        cover: image(),
        date: z.date(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().optional(),
      }),
  }),
  projects: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string().max(160),
        cover: image(),
        startDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]), // Accepts YYYY-MM-DD or YYYY-MM
        endDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]).optional(), // Accepts YYYY-MM-DD or YYYY-MM
        tags: z.array(z.string()).default([]),
        draft: z.boolean().optional(),
        featured: z.boolean().optional().default(false), // Manual control for featuring on homepage
        status: z.enum(["completed", "in-progress", "planned"]).default("completed"),
        githubUrl: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
        // Version support
        versionsTitle: z.string().optional(), // Optional: Custom title for versions section (empty string = no header)
        versions: z.array(z.object({
          version: z.string(), // e.g., "v1", "v2", "2.0"
          title: z.string(), // e.g., "Basic Gripper", "Servo Upgrade"
          description: z.string(),
          content: z.string().optional(), // Optional: Markdown content for detailed technical documentation
          startDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]),
          endDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]).optional(),
          status: z.enum(["completed", "in-progress", "planned"]).default("completed"),
          images: z.array(image()).optional(),
          githubUrl: z.string().url().optional(), // Optional: Version-specific repository link
          liveUrl: z.string().url().optional(),
          achievements: z.array(z.string()).optional(), // Optional: Key accomplishments for this version
          learnings: z.array(z.string()).optional(), // Optional: Insights gained during this version
        })).optional(),
      }),
  }),
};