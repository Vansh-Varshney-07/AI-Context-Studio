/**
 * Trigger a client-side download of arbitrary text content.
 */
export function downloadFile(
  filename: string,
  content: string,
  mimeType = "text/plain",
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  window.document.body.appendChild(anchor);
  anchor.click();
  window.document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to the clipboard using the async Clipboard API with a
 * legacy execCommand fallback for unsupported environments.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = window.document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    window.document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = window.document.execCommand("copy");
    window.document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Convert a display name into a filesystem-safe slug.
 * e.g. "Claude Instructions" -> "claude-instructions".
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
