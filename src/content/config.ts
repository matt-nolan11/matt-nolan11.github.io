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
 * Nested sections support:
 * - Sections can contain columns with content, galleries, images, or nested sections
 * - This enables complex multi-level layouts and nested content structures
 */

export const collections = {
  posts: defineCollection({
    type: "content",
    schema: ({ image }) => {
      // Create typed column schema for posts
      const typedColumnSchema: z.ZodType<any> = z.lazy(() => 
        z.object({
          type: z.enum(['content', 'gallery', 'image', 'model', 'sections']),
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
        // Nested modular sections for posts
        sections: z.array(z.object({
          columns: z.array(typedColumnSchema).min(1).max(4),
        })).optional(),
      });
    },
  }),
  projects: defineCollection({
    type: "content",
    schema: ({ image }) => {
      // Create typed column schema for projects
      const typedColumnSchema: z.ZodType<any> = z.lazy(() => 
        z.object({
          type: z.enum(['content', 'gallery', 'image', 'model', 'sections']),
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
        startDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]), // Accepts YYYY-MM-DD or YYYY-MM
        endDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]).optional(), // Accepts YYYY-MM-DD or YYYY-MM
        tags: z.array(z.string()).default([]),
        draft: z.boolean().optional(),
        featured: z.boolean().optional().default(false), // Manual control for featuring on homepage
          featuredOrder: z.number().optional(), // Manual order for featured projects (lower = higher priority)
        status: z.enum(["completed", "in-progress", "planned"]).default("completed"),
        githubUrl: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
        // Project metrics and statistics
        metrics: z.object({
          // Custom section title (defaults to "Project Stats")
          sectionTitle: z.string().optional(),
          // Dynamic custom fields - you can add any field with any label
          customFields: z.array(z.object({
            label: z.string(), // The display label (e.g., "Fighting Weight", "Weapon Tip Speed")
            value: z.union([z.string(), z.number()]), // The value (e.g., "3.0 lbs", 8000)
            unit: z.string().optional(), // Optional unit (e.g., "RPM", "lbs", "$")
          })).optional(),
        }).optional(),
        // Competition history
        competitions: z.array(z.object({
          name: z.string(), // e.g., "RCL Nationals 2025"
          date: z.string(), // e.g., "2025-01"
          placement: z.union([z.number(), z.string()]), // e.g., 1, "1st", "Semifinals"
          record: z.string().optional(), // e.g., "3-1", "2-2"
          url: z.string().optional(), // Optional link to event recap, blog post, etc. (relative or absolute URL)
        })).optional(),
        // Competitions display options
        competitionsOptions: z.object({
          sectionTitle: z.string().optional(), // Custom title (defaults to "Competition History")
          maxDisplay: z.number().optional(), // Max competitions to show (defaults to 3, set to 0 for all)
        }).optional(),
        // Overall competition statistics
        competitionStats: z.object({
          // Custom section title (defaults to "Competition Record")
          sectionTitle: z.string().optional(),
          // Dynamic custom stats - you can add any stat with any label
          customStats: z.array(z.object({
            label: z.string(), // The display label (e.g., "Events Entered", "Fight Record")
            value: z.union([z.string(), z.number()]), // The value (e.g., "4", "12-4", "75%")
            highlight: z.boolean().optional(), // Whether to highlight this stat (e.g., win rate, best placement)
            color: z.enum(['success', 'warning', 'error', 'info']).optional(), // Color theme for highlighted stats
          })).optional(),
        }).optional(),
        // Gallery support (for header)
        gallery: z.array(z.object({
          src: image(),
          alt: z.string().optional(), // Made optional - will fallback to caption if not provided
          caption: z.string().optional(),
        })).optional(),
        galleryOptions: z.object({
          size: z.union([
            z.enum(['small', 'medium', 'large', 'full']),
            z.number().min(200).max(1200)
          ]).default('medium'),
          autoplay: z.boolean().default(false),
          autoplayInterval: z.number().default(4000),
          showThumbnails: z.boolean().default(true),
          loop: z.boolean().default(true),
        }).optional(),
        // Nested sectioned content support
        sections: z.array(z.object({
          columns: z.array(typedColumnSchema).min(1).max(4),
        })).optional(),
        // Version support (extend with recursive sections)
        versionsTitle: z.string().optional(), // Optional: Custom title for versions section (empty string = no header)
        versions: z.array(z.object({
          version: z.string(), // e.g., "v1", "v2", "2.0"
          title: z.string(), // e.g., "Basic Gripper", "Servo Upgrade"
          description: z.string(),
          startDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]),
          endDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]).optional(),
          status: z.enum(["completed", "in-progress", "planned"]).default("completed"),
          githubUrl: z.string().url().optional(), // Optional: Version-specific repository link
          liveUrl: z.string().url().optional(),
          achievements: z.array(z.string()).optional(), // Optional: Key accomplishments for this version
          learnings: z.array(z.string()).optional(), // Optional: Insights gained during this version
          // Legacy support
          content: z.string().optional(), // Optional: Markdown content for backward compatibility
          images: z.array(image()).optional(), // Simple image array for backward compatibility
          gallery: z.array(z.object({           // Gallery support per version
            src: image(),
            alt: z.string().optional(), // Made optional - will fallback to caption if not provided
            caption: z.string().optional(),
          })).optional(),
          galleryOptions: z.object({
            size: z.union([
              z.enum(['small', 'medium', 'large', 'full']),
              z.number().min(200).max(1200)
            ]).default('medium'),
            autoplay: z.boolean().default(false),
            autoplayInterval: z.number().default(4000),
            showThumbnails: z.boolean().default(true),
          }).optional(),
          // Nested modular sections per version
          sections: z.array(z.object({
            columns: z.array(typedColumnSchema).min(1).max(4),
          })).optional(),
        })).optional(),
      });
    },
  }),
};