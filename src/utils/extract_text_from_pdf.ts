import "server-only";

import { extractText, getDocumentProxy } from "unpdf";

/**
 * Extracts plain text from a PDF supplied as bytes (e.g. an uploaded File's
 * ArrayBuffer). Pages are joined with blank lines. Returns trimmed text.
 */
export async function extractTextFromPdf(
  data: ArrayBuffer | Uint8Array,
): Promise<string> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const pdf = await getDocumentProxy(bytes);
  const { text } = await extractText(pdf, { mergePages: true });
  return text.trim();
}
