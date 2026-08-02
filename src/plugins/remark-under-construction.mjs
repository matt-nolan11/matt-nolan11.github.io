/**
 * Truncates a document at an <UnderConstruction /> marker.
 *
 * Everything after the marker is dropped from the syntax tree at build time,
 * so unfinished content is never shipped: it stays out of the HTML source, out
 * of the Pagefind search index, and any images it imported are never built.
 *
 * Hiding the content with CSS would do none of those things — Pagefind parses
 * the built HTML statically and does not evaluate CSS, so display:none content
 * still turns up in site search.
 *
 * Only root-level markers count, so "below" unambiguously means the rest of
 * the file. A marker nested inside another element is left alone.
 */

const MARKER_NAME = 'UnderConstruction';

function isMarker(node) {
  // MDX: <UnderConstruction /> parses into a JSX flow element.
  if (node.type === 'mdxJsxFlowElement' && node.name === MARKER_NAME) {
    return true;
  }

  // Plain .md: the same tag arrives as a raw HTML node instead.
  if (node.type === 'html') {
    return new RegExp(`^\\s*<${MARKER_NAME}[\\s/>]`).test(node.value);
  }

  return false;
}

export default function remarkUnderConstruction() {
  return (tree) => {
    const index = tree.children.findIndex(isMarker);
    if (index === -1) return;

    // Keep the marker itself — it renders the banner.
    //
    // Note this also drops any import statements below the marker. That is
    // intended (their assets should not be built), and it is why imports
    // belong at the top of the file as usual.
    tree.children = tree.children.slice(0, index + 1);
  };
}
