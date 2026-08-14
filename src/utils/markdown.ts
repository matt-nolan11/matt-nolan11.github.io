/**
 * The shared `marked` instance for markdown authored inside component props
 * (ModularSection `content` blocks and the like).
 *
 * Those strings never reach the MDX/rehype pipeline, so the site-wide
 * rehype-external-links config in astro.config.mjs cannot see their links.
 * Matching the behaviour here keeps a link's target consistent whether it was
 * written in page prose or in a component prop.
 */

import { Marked } from 'marked';

/** Anything with a scheme or a protocol-relative prefix leaves the site. */
const isExternal = (href: string) => /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(href);

export const markdown = new Marked({
  renderer: {
    link(token) {
      const { href, title, text, tokens } = token;
      const body = tokens ? this.parser.parseInline(tokens) : text;
      const titleAttr = title ? ` title="${title}"` : '';
      // `noopener` is the load-bearing half: without it the new tab gets a
      // window.opener handle back on this page.
      const target = isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${titleAttr}${target}>${body}</a>`;
    },
  },
});
