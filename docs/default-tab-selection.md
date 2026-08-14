# Project Versions: Default Tab Selection

## Overview
The `ProjectVersionsSection` component now supports selecting which tab is displayed by default when the page loads. Previously, it always showed the first (newest) version tab.

## Usage

### By Index (Numeric)
Select a tab by its position in the sorted list (0-based):

```astro
<!-- Show the 2nd tab by default -->
<ProjectVersionsSection 
  defaultTab={1}
/>

<!-- Show the 3rd tab by default -->
<ProjectVersionsSection 
  defaultTab={2}
/>
```

### By Name (String)
Select a tab by its version name. The search is case-insensitive and supports partial matching:

```astro
<!-- Show v2.0 tab by default (exact match) -->
<ProjectVersionsSection 
  defaultTab="v2.0"
/>

<!-- Show v3 tab by default (partial match) -->
<ProjectVersionsSection 
  defaultTab="v3"
/>

<!-- Show "Version 2" tab by default (case-insensitive) -->
<ProjectVersionsSection 
  defaultTab="version 2"
/>
```

### Full Example
```astro
import ProjectVersionsSection from '../../../components/ProjectVersionsSection.astro';

<ProjectVersionsSection 
  sectionTitle="Design Iterations"
  titleDepth={1}
  tabStyle="bordered"
  defaultTab="v2.0"
  className="mt-12"
/>
```

## Behavior

- **Default value**: `0` (shows the first/newest tab, maintains backward compatibility)
- **Invalid index**: Clamped to valid range `[0, versions.length - 1]`
- **Matching failure**: Falls back to the first tab
- **Sorting order**: Tabs are sorted by semantic version (descending), then by date, then by index

## Common Scenarios

### Show the Latest Stable Version
If you want to highlight a specific version (e.g., v2.0) while newer versions exist:

```astro
<ProjectVersionsSection defaultTab="v2.0" />
```

### Show the Latest Version (Default Behavior)
```astro
<!-- These are equivalent -->
<ProjectVersionsSection />
<ProjectVersionsSection defaultTab={0} />
```

### Show a Specific Older Version
```astro
<ProjectVersionsSection defaultTab="v1.0" />
```

## Implementation Details

The component:
1. Collects all version files (v1.mdx, v2.mdx, etc.)
2. Sorts them by semantic version (descending)
3. Finds the index of the requested `defaultTab`
4. Sets that radio button as checked on page load

The UI uses HTML radio buttons for state management, so the selected tab is deterministic and matches the server-rendered state.
