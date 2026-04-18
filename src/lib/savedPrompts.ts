import { useEffect, useState, useCallback } from "react";
import type { Platform } from "./promptForge";

export interface SavedPrompt {
  id: string;
  title: string;
  prompt: string;
  platform: Platform;
  tags: string[];
  createdAt: number;
}

const KEY = "promptforge:saved:v1";

function read(): SavedPrompt[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: SavedPrompt[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("promptforge:saved-changed"));
}

export function useSavedPrompts() {
  const [items, setItems] = useState<SavedPrompt[]>([]);

  useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener("promptforge:saved-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("promptforge:saved-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const save = useCallback((p: Omit<SavedPrompt, "id" | "createdAt">) => {
    const all = read();
    if (all.some((x) => x.prompt === p.prompt)) return null;
    const item: SavedPrompt = {
      ...p,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    write([item, ...all]);
    return item;
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((x) => x.id !== id));
  }, []);

  const rename = useCallback((id: string, title: string) => {
    write(read().map((x) => (x.id === id ? { ...x, title } : x)));
  }, []);

  const isSaved = useCallback((prompt: string) => items.some((x) => x.prompt === prompt), [items]);

  return { items, save, remove, rename, isSaved };
}
