// src/content/config.ts
import { defineCollection, z } from "astro:content";

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
        // Gallery support
        gallery: z.array(z.object({
          src: image(),
          alt: z.string(),
          caption: z.string().optional(),
        })).optional(),
        galleryPosition: z.enum(['replace-cover', 'after-content', 'before-versions', 'dedicated-section']).default('replace-cover'),
        galleryTitle: z.string().optional(),
        galleryOptions: z.object({
          size: z.union([
            z.enum(['small', 'medium', 'large', 'full']), // Preset sizes
            z.number().min(200).max(1200)                  // Custom pixel width (200px - 1200px)
          ]).default('medium'),
          autoplay: z.boolean().default(false),
          autoplayInterval: z.number().default(4000),
          showThumbnails: z.boolean().default(true),
          showIndicators: z.boolean().default(true),
          layout: z.enum(['default', 'side-by-side', 'wrapped', 'stacked']).default('default'),
          float: z.enum(['left', 'right', 'center']).optional(),
        }).optional(),
        // Sectioned content support
        sections: z.array(z.object({
          type: z.enum(['content', 'gallery', 'interleaved']),
          title: z.string().optional(),
          content: z.string().optional(), // Markdown content for content sections
          gallery: z.array(z.object({     // Gallery data for gallery sections
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
          })).optional(),
          // For interleaved sections - mix of content and gallery
          contentGalleryPairs: z.array(z.object({
            content: z.string().optional(),
            gallery: z.array(z.object({
              src: image(),
              alt: z.string(),
              caption: z.string().optional(),
            })).optional(),
            layout: z.enum(['side-by-side', 'content-first', 'gallery-first', 'wrapped']).default('side-by-side'),
          })).optional(),
          galleryOptions: z.object({
            size: z.union([
              z.enum(['small', 'medium', 'large', 'full']), // Preset sizes
              z.number().min(200).max(1200)                  // Custom pixel width (200px - 1200px)
            ]).default('medium'),
            autoplay: z.boolean().default(false),
            autoplayInterval: z.number().default(4000),
            showThumbnails: z.boolean().default(true),
            showIndicators: z.boolean().default(true),
            layout: z.enum(['default', 'side-by-side', 'wrapped', 'stacked']).default('default'),
            float: z.enum(['left', 'right', 'center']).optional(),
          }).optional(),
        })).optional(),
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
          images: z.array(image()).optional(), // Legacy: Simple image array
          gallery: z.array(z.object({           // New: Full gallery support per version
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
          })).optional(),
          galleryOptions: z.object({
            size: z.union([
              z.enum(['small', 'medium', 'large', 'full']), // Preset sizes
              z.number().min(200).max(1200)                  // Custom pixel width (200px - 1200px)
            ]).default('medium'),
            autoplay: z.boolean().default(false),
            autoplayInterval: z.number().default(4000),
            showThumbnails: z.boolean().default(true),
            showIndicators: z.boolean().default(true),
            layout: z.enum(['default', 'side-by-side', 'wrapped', 'stacked']).default('default'),
            float: z.enum(['left', 'right', 'center']).optional(),
          }).optional(),
          githubUrl: z.string().url().optional(), // Optional: Version-specific repository link
          liveUrl: z.string().url().optional(),
          achievements: z.array(z.string()).optional(), // Optional: Key accomplishments for this version
          learnings: z.array(z.string()).optional(), // Optional: Insights gained during this version
        })).optional(),
      }),
  }),
};