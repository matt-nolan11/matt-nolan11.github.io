// src/utils/versionUtils.ts
import { getCollection, type CollectionEntry } from 'astro:content';

export interface ProjectVersion {
  content: CollectionEntry<'projects'>;
}

/**
 * Get all version files for a project (excluding the main index.mdx)
 *
 * Any sibling of index.mdx counts as a version — the filename is not parsed for
 * anything, so v1.mdx, v2_1.mdx and prototype1.mdx are all equally valid. Tab
 * labels come from each file's `tabTitle` frontmatter and ordering comes from
 * that title, so the filename is purely organisational. This deliberately does
 * not filter on a `v` prefix: that filter used to drop correctly-authored
 * version files on the floor and render no tabs at all, with no error to say why.
 */
export async function getProjectVersions(projectSlug: string): Promise<ProjectVersion[]> {
  const allProjects = await getCollection('projects');

  // Find all version files for this project (excluding index files)
  const versionFiles = allProjects.filter(p => {
    const parts = p.id.split('/');
    const directory = parts.slice(0, -1).join('/');
    const fileName = parts[parts.length - 1];
    const baseName = fileName.replace(/\.(mdx?|md)$/, '');

    // Check if it's in the same directory and is a version file (not index)
    return directory === projectSlug && baseName !== 'index';
  });
  
  // Map directly to minimal structure; keep natural order
  return versionFiles.map((versionFile) => ({ content: versionFile }));
}

/**
 * Check if a project has multiple versions
 */
export async function hasMultipleVersions(projectSlug: string): Promise<boolean> {
  const versions = await getProjectVersions(projectSlug);
  return versions.length > 1;
}
