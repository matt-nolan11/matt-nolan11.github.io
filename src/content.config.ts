import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
// `astro:content` re-exports `z` as a value only, so `z.ZodType` is not usable
// as a type annotation. The underlying zod build is reachable at astro/zod,
// which is where the type has to come from.
import type { ZodType } from "astro/zod";
import { LINK_COLORS, LINK_ICONS } from "./utils/linkButtons";

/**
 * Content collections schema for the portfolio site.
 *
 * Projects support flexible versioned development:
 * - Core fields: version, title, description, startDate, status
 * - Optional enhancements: content (markdown), achievements, learnings, links
 * - Supports minimal versions (just basic info) or rich documentation
 * - Markdown content is rendered with prose styling when provided
 * - versionsTitle: customize or hide the versions section header
 *   - undefined/null: shows "Project Versions" (default)
 *   - custom string: shows your custom title
 *   - empty string "": hides the header completely
 *
 * Tags and Summary:
 * - Tags are defined in the page frontmatter (source of truth for categorization)
 * - To display tags in Summary elements, pass frontmatterTags prop to ModularSection
 * - Example: <ModularSection frontmatterTags={["tag1", "tag2"]} columns={[...]} />
 * - The showTags prop on summary blocks controls tag visibility (default: true if tags available)
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

/**
 * An action-link button rendered by Summary and ProjectCard.
 *
 * The colour and icon presets come straight from utils/linkButtons.ts, so the
 * schema and the renderer cannot disagree about what is valid. Both are
 * optional: colour defaults to blue, and the icon is guessed from the host
 * (GitHub and YouTube links get their logos, everything else an external-link
 * arrow) unless one is named.
 */
const projectLinkSchema = z.object({
  url: z.string().url(),
  label: z.string(),
  color: z.enum(LINK_COLORS).optional(),
  icon: z.enum(LINK_ICONS).optional(),
});

export const collections = {
  posts: defineCollection({
    loader: glob({
      base: "./src/content/posts",
      pattern: "**/*.{md,mdx}",
    }),
    schema: ({ image }) => {
      // Create typed column schema for posts
      // The annotation is load-bearing, not decoration: `sections` nests this
      // same schema inside itself, and TypeScript cannot infer a recursive type.
      const typedColumnSchema: ZodType<any> = z.lazy(() =>
        z.object({
          type: z.enum(["content", "gallery", "image", "model", "summary", "video"]),
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
          modelOptions: z
            .object({
              autoRotate: z.boolean().default(false),
              cameraControls: z.boolean().default(true),
              ar: z.boolean().default(false),
              size: z
                .union([z.enum(["small", "medium", "large", "full"]), z.number().min(200).max(1200)])
                .default("medium"),
              exposureCompensation: z.number().default(1),
              shadowIntensity: z.number().default(1),
              shadowSoftness: z.number().default(1),
              interactionPrompt: z.enum(["auto", "when-focused", "none"]).default("auto"),
              loading: z.enum(["auto", "lazy", "eager"]).default("lazy"),
            })
            .optional(),
          // For gallery columns
          gallery: z
            .array(
              z.object({
                src: image(),
                alt: z.string().optional(), // Made optional - will fallback to caption if not provided
                caption: z.string().optional(),
              }),
            )
            .optional(),
          galleryOptions: z
            .object({
              size: z
                .union([z.enum(["small", "medium", "large", "full"]), z.number().min(200).max(1200)])
                .default("medium"),
              autoplay: z.boolean().default(false),
              autoplayInterval: z.number().default(4000),
              showThumbnails: z.boolean().default(true),
            })
            .optional(),
          // For summary columns (project info display)
          summaryTitle: z.string().optional(),
          summaryDescription: z.string().optional(),
          showTags: z.boolean().optional(), // Whether to display tags in summary (default: true if tags available). Tags come from page frontmatter or block.tags
          videoId: z.string().optional(),
          videoTitle: z.string().optional(),
          videoAspect: z.string().optional(),
          videoStart: z.number().optional(),
          videoAutoplay: z.boolean().optional(),
          videoMuted: z.boolean().optional(),
          videoControls: z.boolean().optional(),
          videoCaption: z.string().optional(),
          startDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]).optional(),
          endDate: z.union([z.date(), z.string().regex(/^\d{4}-\d{2}$/)]).optional(),
          status: z.enum(["completed", "in-progress", "active", "paused", "planned"]).optional(),
          headerTitleSize: z.enum(["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]).optional(),
          metrics: z
            .object({
              sectionTitle: z.string().optional(),
              customFields: z
                .array(
                  z.object({
                    label: z.string(),
                    value: z.union([z.string(), z.number()]),
                    unit: z.string().optional(),
                    highlight: z.boolean().optional(),
                    color: z.enum(["success", "warning", "error", "info"]).optional(),
                  }),
                )
                .optional(),
            })
            .optional(),
          competitions: z
            .array(
              z.object({
                name: z.string(),
                date: z.string(),
                placement: z.union([z.number(), z.string()]),
                record: z.string().optional(),
                url: z.string().optional(),
              }),
            )
            .optional(),
          competitionsOptions: z
            .object({
              sectionTitle: z.string().optional(),
              maxDisplay: z.number().optional(),
            })
            .optional(),
          tags: z.array(z.string()).optional(), // DEPRECATED: Use page frontmatter tags instead. This is kept for backward compatibility only.
          links: z.array(projectLinkSchema).optional(),
          // For nested sections
          sections: z
            .array(
              z.object({
                columns: z.array(typedColumnSchema).min(1).max(4),
              }),
            )
            .optional(),
        }),
      );

      return z.object({
        title: z.string(),
        description: z.string().max(160),
        cover: image(),
        coverCaption: z.string().optional(),
        date: z.date(),
        updated: z.date().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().optional(),
        // Optional custom max-width override (CSS value like "80rem", "1200px", "calc(100vw - 10rem)")
        maxWidth: z.string().optional(),
        // Gallery support (for header)
        gallery: z
          .array(
            z.object({
              src: image(),
              alt: z.string().optional(), // Made optional - will fallback to caption if not provided
              caption: z.string().optional(),
            }),
          )
          .optional(),
      });
    },
  }),
  projects: defineCollection({
    loader: glob({
      base: "./src/content/projects",
      pattern: "**/*.{md,mdx}",
    }),
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
        status: z.enum(["completed", "in-progress", "active", "paused", "planned"]).default("completed"),
        links: z.array(projectLinkSchema).optional(),

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