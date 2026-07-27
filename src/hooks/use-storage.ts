"use client";

import { useCallback, useState } from "react";

import { saveAsset, getAsset, getAllAssets, getAssetsByKind, deleteAsset, type Asset } from "@/services/storage";
import { uuid } from "@/utils/uuid";

/**
 * Hook for persisting generated artifacts to IndexedDB.
 */
export function useStorage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async <T extends Record<string, unknown>>(
    kind: string,
    title: string,
    content: T,
    options?: {
      description?: string;
      category?: string;
      tags?: string[];
      favorite?: boolean;
      pinned?: boolean;
      metadata?: Record<string, string>;
    }
  ): Promise<Asset | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const id = uuid();
      const now = new Date().toISOString();
      const asset: Asset = {
        id,
        kind,
        title,
        description: options?.description ?? "",
        category: options?.category,
        tags: options?.tags ?? [],
        favorite: options?.favorite ?? false,
        pinned: options?.pinned ?? false,
        content,
        metadata: options?.metadata ?? {},
        createdAt: now,
        updatedAt: now,
      };
      await saveAsset(asset);
      return asset;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const load = useCallback(async (id: string): Promise<Asset | undefined> => {
    setIsLoading(true);
    setError(null);
    try {
      return await getAsset(id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Load failed";
      setError(msg);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAll = useCallback(async (): Promise<Asset[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await getAllAssets();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Load all failed";
      setError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadByKind = useCallback(async (kind: string): Promise<Asset[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await getAssetsByKind(kind);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Load by kind failed";
      setError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteAsset(id);
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { save, load, loadAll, loadByKind, remove, isLoading, error };
}