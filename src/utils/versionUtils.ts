// src/utils/versionUtils.ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { basename, dirname } from 'path';

export interface ProjectVersion {
  version: string;
  title: string;
  filePath: string;
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
  
  const versions: ProjectVersion[] = [];
  
  // Add version files only
  for (const versionFile of versionFiles) {
    // Use filename as version identifier (not needed for display)
    const parts = versionFile.id.split('/');
    const fileName = parts[parts.length - 1];
    const baseName = fileName.replace(/\.(mdx?|md)$/, '');
    
    versions.push({
      version: baseName, // Just use filename for internal sorting
      title: versionFile.data.title,
      filePath: versionFile.id,
      content: versionFile
    });
  }
  
  // Sort versions from newest to oldest based on dates
  versions.sort((a, b) => {
    // Use startDate for sorting if available
    const aDate = a.content.data.startDate;
    const bDate = b.content.data.startDate;
    
    if (aDate && bDate) {
      const aTime = typeof aDate === 'string' ? new Date(aDate + '-01').getTime() : aDate.getTime();
      const bTime = typeof bDate === 'string' ? new Date(bDate + '-01').getTime() : bDate.getTime();
      return bTime - aTime; // Newest first
    }
    
    // Fallback to version name comparison
    return b.version.localeCompare(a.version, undefined, { numeric: true });
  });
  
  return versions;
}

/**
 * Check if a project has multiple versions
 */
export async function hasMultipleVersions(projectSlug: string): Promise<boolean> {
  const versions = await getProjectVersions(projectSlug);
  return versions.length > 1;
}
