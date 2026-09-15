import { marked } from 'marked';

marked.use({ gfm: true, breaks: false });

/** Render a Markdown string coming from the content files (trusted content). */
export function renderMarkdown(source: string | undefined): string {
  if (!source) return '';
  return marked.parse(source, { async: false }) as string;
}

/** Inline Markdown (links, emphasis) without wrapping <p>. */
export function renderInline(source: string | undefined): string {
  if (!source) return '';
  return marked.parseInline(source, { async: false }) as string;
}
