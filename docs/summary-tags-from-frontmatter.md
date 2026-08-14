# Summary Tags: Using Frontmatter (Automatic via Astro.locals)

## Overview
Tags are defined once in your project's frontmatter and automatically used by Summary components. No manual passing or duplication needed. Tags are **hidden by default** and must be explicitly shown with `showTags: true`.

## How It Works

Tags are your source of truth in frontmatter:

```mdx
---
title: "My Project"
tags: ["robotics", "3d printing", "electronics"]
---

import ModularSection from '../../../components/ModularSection.astro';

<ModularSection 
  columns={[
    {
      type: "summary",
      summaryTitle: "Project Info",
      showTags: true  // Explicitly enable tag display
    }
  ]}
/>
```

The [slug].astro page automatically makes frontmatter tags available to all components via `Astro.locals`, so ModularSection and Summary can access them without any manual passing.

## Control Tag Visibility

**Show tags (must be explicit):**
```mdx
{
  type: "summary",
  showTags: true  // Explicitly show tags
}
```

**Hide tags (default):**
```mdx
{
  type: "summary"
  // showTags omitted or false: tags are hidden
}
```

**Explicitly hide tags:**
```mdx
{
  type: "summary",
  showTags: false  // Explicitly hide (same as omitting)
}
```

## Best Practices

- **Main project pages (index.mdx)**: Set `showTags: true` to display project tags
- **Version pages (v1.mdx, v2.mdx, etc.)**: Omit `showTags` or set to `false` to keep version pages clean
- Tags will never be duplicated since they come from frontmatter only
- Change frontmatter tags and they automatically update everywhere they're shown

## Benefits

1. **Single source of truth** — Tags defined once in frontmatter
2. **Zero duplication** — No need to repeat or pass tags anywhere
3. **Automatic sync** — Change frontmatter tags, they update everywhere
4. **Version control** — Show tags on main pages, hide on version pages with simple prop
5. **Zero configuration** — Summary components just work
6. **Optional visibility control** — Use `showTags` to control per-block

## Migration Guide

### Before (Old Way - Not Recommended)
```mdx
---
title: "My Project"
tags: ["robotics", "3d printing"]
---

<ModularSection 
  columns={[
    {
      type: "summary",
      tags: ["robotics", "3d printing"]  // ❌ Duplicated!
    }
  ]}
/>
```

### After (New Way - Automatic)
```mdx
---
title: "My Project"
tags: ["robotics", "3d printing"]
---

<ModularSection 
  columns={[
    {
      type: "summary",
      showTags: true  // ✅ Explicitly enable if you want tags shown
    }
  ]}
/>
```

## Technical Details

- Tags are defined in project frontmatter (source of truth)
- `[slug].astro` sets `Astro.locals.frontmatterTags` from frontmatter data
- ModularSection reads from `Astro.locals.frontmatterTags` automatically
- Summary receives tags and displays them only if `showTags === true`
- Default: tags are **hidden** (showTags defaults to false)

## Legacy Support

The old `tags` field in summary blocks is still supported for backward compatibility but is **deprecated**. Remove it from your projects as you update them.
