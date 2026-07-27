// Platform abstraction layer
// Detects Tauri vs web and dispatches to native commands or browser fallbacks

import { isTauri } from "@tauri-apps/api/core";

export { isTauri };

export async function readFile(path: string): Promise<string> {
  if (isTauri()) {
    const { invoke } = await import("@tauri-apps/api/core");
    return invoke<string>("read_text_file", { path });
  }
  throw new Error("readFile is not available in web mode");
}

export async function writeFile(path: string, content: string): Promise<void> {
  if (isTauri()) {
    const { invoke } = await import("@tauri-apps/api/core");
    await invoke("write_text_file", { path, content });
    return;
  }
  throw new Error("writeFile is not available in web mode");
}

export async function showSaveDialog(
  content: string,
  defaultName = "untitled.txt",
): Promise<string | null> {
  if (isTauri()) {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const { writeFile: fsWrite } = await import("@tauri-apps/plugin-fs");
    const filePath = await save({
      defaultPath: defaultName,
    });
    if (filePath) {
      const encoder = new TextEncoder();
      await fsWrite(filePath, encoder.encode(content));
      return filePath;
    }
    return null;
  }
  // Web fallback: use download
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = defaultName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return null;
}

export async function showOpenDialog(
  filters: { name: string; extensions: string[] }[] = [],
): Promise<string | null> {
  if (isTauri()) {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const result = await open({
      multiple: false,
      filters,
    });
    return typeof result === "string" ? result : null;
  }
  throw new Error("showOpenDialog is not available in web mode");
}

export async function openExternal(url: string): Promise<void> {
  if (isTauri()) {
    const { openUrl } = await import("@tauri-apps/plugin-opener");
    await openUrl(url);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function copyToClipboard(text: string): Promise<void> {
  if (isTauri()) {
    const { invoke } = await import("@tauri-apps/api/core");
    await invoke("copy_to_clipboard", { text });
    return;
  }
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export async function getAppDataDir(): Promise<string> {
  if (isTauri()) {
    const { invoke } = await import("@tauri-apps/api/core");
    return invoke<string>("get_app_data_dir");
  }
  return "browser";
}

export async function getPlatformInfo(): Promise<PlatformInfo> {
  if (isTauri()) {
    const { invoke } = await import("@tauri-apps/api/core");
    return invoke<PlatformInfo>("get_platform_info");
  }
  return {
    os: typeof navigator !== "undefined" ? navigator.platform : "unknown",
    arch: "unknown",
    version: "web",
    hostname: "browser",
  };
}

export interface PlatformInfo {
  os: string;
  arch: string;
  version: string;
  hostname: string;
}
