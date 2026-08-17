/**
 * Action-link buttons, shared by Summary (project page) and ProjectCard (grid)
 * so a project's links read the same wherever they appear.
 *
 * A link is `{ url, label, color?, icon? }`. Colours and icons are preset
 * names rather than raw classes or markup, so content files never have to know
 * about DaisyUI or carry SVG, and a preset can be re-tuned in one place.
 *
 * Every button goes through this list — GitHub and live demos included. They
 * had dedicated `githubUrl`/`liveUrl` fields once; those are gone.
 */

export const LINK_COLORS = ['blue', 'green', 'orange', 'red', 'yellow', 'neutral'] as const;
export type LinkColor = (typeof LINK_COLORS)[number];

export const LINK_ICONS = [
  'external',
  'download',
  'document',
  'link',
  'code',
  'cube',
  'cart',
  'play',
  'github',
  'youtube',
  'none',
] as const;
export type LinkIcon = (typeof LINK_ICONS)[number];

export interface ProjectLink {
  url: string;
  label: string;
  color?: LinkColor;
  icon?: LinkIcon;
}

export const DEFAULT_LINK_COLOR: LinkColor = 'blue';

/**
 * Class names are written out in full, never assembled from fragments —
 * Tailwind scans source text for literal class strings, and a `btn-${color}`
 * template would be invisible to it.
 *
 * `orange` is the one preset without a DaisyUI semantic behind it: `accent` is
 * teal in the corporate theme and orange in business, so it cannot be trusted
 * to stay orange. `.btn-orange` is defined in global.css instead.
 */
const COLOR_CLASS: Record<LinkColor, string> = {
  blue: 'btn-primary',
  green: 'btn-success',
  orange: 'btn-orange',
  red: 'btn-error',
  yellow: 'btn-warning',
  neutral: 'btn-outline',
};

/** DaisyUI (or custom) button class for a colour preset. */
export function linkColorClass(color?: LinkColor): string {
  return (color && COLOR_CLASS[color]) || COLOR_CLASS[DEFAULT_LINK_COLOR];
}

export interface IconDef {
  /** Every path in the glyph, drawn in order. */
  paths: string[];
  viewBox: string;
  /** Outline glyphs are stroked; brand marks are solid shapes. */
  mode: 'stroke' | 'fill';
  /** Solid glyphs with interior cut-outs need the even-odd winding rule. */
  evenOdd?: boolean;
}

/**
 * The utility glyphs are Heroicons outline, all on the same 24x24 stroke grid
 * so they sit identically inside a button. The brand marks are the official
 * solid logos and keep their own viewBoxes — rescaling them by hand is how
 * logos end up subtly wrong.
 */
const ICON_DEFS: Record<Exclude<LinkIcon, 'none'>, IconDef> = {
  external: {
    paths: ['M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'],
    viewBox: '0 0 24 24',
    mode: 'stroke',
  },
  download: {
    paths: ['M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'],
    viewBox: '0 0 24 24',
    mode: 'stroke',
  },
  document: {
    paths: [
      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    ],
    viewBox: '0 0 24 24',
    mode: 'stroke',
  },
  link: {
    paths: [
      'M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5',
    ],
    viewBox: '0 0 24 24',
    mode: 'stroke',
  },
  code: {
    paths: ['M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'],
    viewBox: '0 0 24 24',
    mode: 'stroke',
  },
  cube: {
    paths: ['M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'],
    viewBox: '0 0 24 24',
    mode: 'stroke',
  },
  cart: {
    paths: [
      'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    ],
    viewBox: '0 0 24 24',
    mode: 'stroke',
  },
  play: {
    paths: [
      'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z',
      'M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    ],
    viewBox: '0 0 24 24',
    mode: 'stroke',
  },
  github: {
    paths: [
      'M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z',
    ],
    viewBox: '0 0 20 20',
    mode: 'fill',
    evenOdd: true,
  },
  youtube: {
    paths: [
      'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    ],
    viewBox: '0 0 24 24',
    mode: 'fill',
  },
};

/**
 * Icon for a link that did not name one.
 *
 * Guessing from the host means a GitHub or YouTube link is marked correctly
 * without the author repeating themselves. Note `*.github.io` is deliberately
 * NOT GitHub — those are Pages sites, i.e. ordinary external links.
 */
function inferIcon(url: string): LinkIcon {
  let hostname: string;
  try {
    hostname = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'external';
  }
  if (hostname === 'github.com' || hostname.endsWith('.github.com')) return 'github';
  if (hostname === 'youtube.com' || hostname === 'youtu.be' || hostname.endsWith('.youtube.com')) {
    return 'youtube';
  }
  return 'external';
}

export interface ResolvedLink extends ProjectLink {
  /** Always set once resolved — inferred from the host if the author omitted it. */
  icon: LinkIcon;
  colorClass: string;
  /** The glyph to draw, or null when the link opted out with `icon: 'none'`. */
  iconDef: IconDef | null;
}

/**
 * Fills in each link's colour class and glyph, in authored order.
 *
 * Entries without a `url` are dropped rather than rendered as dead buttons —
 * frontmatter is hand-written, and a half-filled entry should not ship.
 */
export function resolveLinks(links?: ProjectLink[]): ResolvedLink[] {
  return (links ?? [])
    .filter((link) => link?.url)
    .map((link) => {
      const icon = link.icon ?? inferIcon(link.url);
      return {
        ...link,
        icon,
        label: link.label || 'Link',
        colorClass: linkColorClass(link.color),
        iconDef: icon === 'none' ? null : ICON_DEFS[icon],
      };
    });
}
