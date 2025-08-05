// src/components/ProjectVersionTabs.tsx
import React, { useState } from 'react';

export interface VersionTab {
  version: string;
  title: string;
  slug: string; // We'll use this to load content dynamically
}

interface ProjectVersionTabsProps {
  versions: VersionTab[];
  currentContent: string; // HTML content for the current/main version
  className?: string;
}

export default function ProjectVersionTabs({ 
  versions, 
  currentContent,
  className = '' 
}: ProjectVersionTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [loadedVersions, setLoadedVersions] = useState<Record<number, string>>({
    0: currentContent // Main content is pre-loaded
  });
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  if (versions.length <= 1) {
    // If only one version, render without tabs
    return (
      <div className={className}>
        <div 
          dangerouslySetInnerHTML={{ __html: currentContent }}
          className="prose prose-lg max-w-none dark:prose-invert"
        />
      </div>
    );
  }

  const handleTabClick = async (index: number) => {
    setActiveTab(index);
    
    // If content is already loaded, don't fetch again
    if (loadedVersions[index]) return;
    
    // If it's the main version (index 0), we already have it
    if (index === 0) return;
    
    // Load the version content
    setLoading(prev => ({ ...prev, [index]: true }));
    
    try {
      const versionSlug = versions[index].slug;
      const response = await fetch(`/api/version-content/${versionSlug}`);
      if (response.ok) {
        const html = await response.text();
        setLoadedVersions(prev => ({ ...prev, [index]: html }));
      } else {
        console.error('Failed to load version content');
      }
    } catch (error) {
      console.error('Error loading version content:', error);
    } finally {
      setLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className="tabs tabs-boxed bg-base-200 mb-6">
        {versions.map((version, index) => (
          <button
            key={version.version}
            className={`tab tab-lg ${index === activeTab ? 'tab-active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            <div className="flex flex-col items-center">
              <span className="font-semibold text-sm">{version.version}</span>
              <span className="text-xs opacity-70 hidden sm:block">{version.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-96">
        {versions.map((version, index) => (
          <div
            key={version.version}
            className={`transition-opacity duration-200 ${
              index === activeTab ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
            }`}
          >
            {loading[index] ? (
              <div className="flex items-center justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
                <span className="ml-2">Loading {version.version}...</span>
              </div>
            ) : loadedVersions[index] ? (
              <div 
                dangerouslySetInnerHTML={{ __html: loadedVersions[index] }}
                className="prose prose-lg max-w-none dark:prose-invert"
              />
            ) : (
              <div className="flex items-center justify-center py-8 text-base-content/60">
                Click to load {version.version}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
