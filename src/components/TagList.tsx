import React from "react";

/**
 * Renders a list of tag badges with stopPropagation on click.
 * @param tags - Array of tag strings
 * @param size - Badge size variant
 */
export interface TagListProps {
  tags: string[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const TagList: React.FC<TagListProps> = ({ tags, size = 'xs' }) => (
  <div className="flex flex-wrap gap-1">
    {tags.map((tag) => (
      <a
        key={tag}
        href={`/tags/${tag}/`}
        className={`badge badge-outline badge-${size} tag-hover-light-blue transition-colors`}
        onClick={(e) => e.stopPropagation()}
      >
        {tag}
      </a>
    ))}
  </div>
);

export default TagList;
