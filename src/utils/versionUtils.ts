// src/utils/versionUtils.ts
import { getCollection, type CollectionEntry } from 'astro:content';

export interface ProjectVersion {
  content: CollectionEntry<'projects'>;
}

/**
 * Get all version files for a project (excluding the main index.mdx)
 * Version files should be named like: v1.mdx, v2.mdx, version-2.0.mdx, etc.
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
    return directory === projectSlug && 
           baseName !== 'index' && 
           (baseName.match(/^v\d+/) || baseName.match(/^version/) || baseName.startsWith('v'));
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
