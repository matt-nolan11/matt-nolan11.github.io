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
 * 
 * Version header support:
 * - Optional header information for each version in the same format as main project header
 * - headerTitle: separate title for version header (defaults to title)
 * - tabTitle: separate title for tab button (defaults to version)
 * - headerDescription: override description for header (defaults to description)
 * - cover: version-specific cover image
 * - metrics, competitions: version-specific data
 * - If any header fields are present, shows full header layout
 * - If no header fields, shows compact legacy layout
 */

export const collections = {
  posts: defineCollection({
    type: "content",
    schema: ({ image }) => {
      // Create typed column schema for posts
      const typedColumnSchema: z.ZodType<any> = z.lazy(() => 
        z.object({
          type: z.enum(['content', 'gallery', 'image', 'model', 'summary', 'video']),
          title: z.string().optional(),
          // For content columns
          content: z.string().optional(),
          // For image columns
          src: image().optional(),
          alt: z.string().optional(),
          caption: z.string().optional(),
          // For model columns (3D viewer)
          modelSrc: z.string().optional(),
          poster: z.string().optional(),
          environmentImage: z.string().optional(),
          modelOptions: z.object({
            autoRotate: z.boolean().default(false),
            cameraControls: z.boolean().default(true),
            ar: z.boolean().default(false),
            size: z.union([
              z.enum(['small', 'medium', 'large', 'full']),
              z.number().min(200).max(1200)
            ]).default('medium'),
            exposureCompensation: z.number().default(1),
            shadowIntensity: z.number().default(1),
            shadowSoftness: z.number().default(1),
            interactionPrompt: z.enum(['auto', 'when-focused', 'none']).default('auto'),
            loading: z.enum(['auto', 'lazy', 'eager']).default('lazy'),
          }).optional(),
          // For gallery columns
          gallery: z.array(z.object({ 
            src: image(), 
            alt: z.string().optional(), // Made optional - will fallback to caption if not provided
            caption: z.string().optional() 
          })).optional(),
          galleryOptions: z.object({
            size: z.union([
              z.enum(['small','medium','large','full']),
              z.number().min(200).max(1200)
            ]).default('medium'),
            autoplay: z.boolean().default(false),
            autoplayInterval: z.number().default(4000),
            showThumbnails: z.boolean().default(true),
          }).optional(),
          // For summary columns (project info display)
          summaryTitle: z.string().optional(),
          // For video columns (YouTube embed)
          videoId: z.string().optional(),
          videoTitle: z.string().optional(),
          videoAspect: z.string().optional(),
          videoStart: z.number().optional(),
          videoAutoplay: z.boolean().optional(),
          videoMuted: z.boolean().optional(),
          videoControls: z.boolean().optional(),
          videoCaption: z.string().optional(),
          summaryDescription: z.string().optional(),
          startDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]).optional(),
          endDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]).optional(),
          status: z.enum(["completed", "in-progress", "planned"]).optional(),
          headerTitleSize: z.enum(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']).optional(),
          metrics: z.object({
            sectionTitle: z.string().optional(),
            customFields: z.array(z.object({
              label: z.string(),
              value: z.union([z.string(), z.number()]),
              unit: z.string().optional(),
              highlight: z.boolean().optional(),
              color: z.enum(['success', 'warning', 'error', 'info']).optional(),
            })).optional(),
          }).optional(),
          competitions: z.array(z.object({
            name: z.string(),
            date: z.string(),
            placement: z.union([z.number(), z.string()]),
            record: z.string().optional(),
            url: z.string().optional(),
          })).optional(),
          competitionsOptions: z.object({
            sectionTitle: z.string().optional(),
            maxDisplay: z.number().optional(),
          }).optional(),
          tags: z.array(z.string()).optional(),
          githubUrl: z.string().url().optional(),
          liveUrl: z.string().url().optional(),
          // For nested sections
          sections: z.array(z.object({
            columns: z.array(typedColumnSchema).min(1).max(4),
          })).optional(),
        })
      );

      return z.object({
        title: z.string(),
        description: z.string().max(160),
        cover: image(),
        coverCaption: z.string().optional(),
        date: z.date(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().optional(),
        // Gallery support (for header)
        gallery: z.array(z.object({
          src: image(),
          alt: z.string().optional(), // Made optional - will fallback to caption if not provided
          caption: z.string().optional(),
        })).optional(),
      });
    },
  }),
  projects: defineCollection({
    type: "content",
    schema: ({ image }) => {
      return z.object({
  // Essential fields for project cards and site navigation
  // For version files (v1.mdx, v2.mdx, ...), the only guaranteed field is tabTitle.
  // Main project index.mdx should provide full metadata.
        title: z.string().optional(),
  description: z.string().max(160).optional(),
        cover: image().optional(), // Optional for version files
        coverCaption: z.string().optional(),
  startDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]).optional(), // Accepts YYYY-MM-DD or YYYY-MM
        endDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]).optional(), // Accepts YYYY-MM-DD or YYYY-MM
        tags: z.array(z.string()).default([]),
        draft: z.boolean().optional(),
        featured: z.boolean().optional().default(false), // Manual control for featuring on homepage
        featuredOrder: z.number().optional(), // Manual order for featured projects (lower = higher priority)
        status: z.enum(["completed", "in-progress", "planned"]).default("completed"),
        githubUrl: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
        
        // Version header fields (for standalone version files like v2.mdx)
        headerTitle: z.string().optional(), // Separate title for version headers
        tabTitle: z.string().optional(), // Separate title for tab buttons
        headerDescription: z.string().optional(), // Override description for headers
        
  // Simplified version support
  versionsTitle: z.string().optional(), // Optional: Custom title for versions section (empty string = no header)
  // For version files: only tabTitle is used for UI labels
      });
    },
  }),
};