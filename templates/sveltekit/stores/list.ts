import { writable } from "svelte/store";
import { fetchApi } from "./fetch";
import { loadingOverlay } from "./loadingOverlay";
import type { ApiResource, TError } from "../utils/types";
import type { PagedCollection } from "../interfaces/Collection";

export interface ListStoreState<Resource extends ApiResource> {
  loading: boolean;
  error: TError;
  retrieved: PagedCollection<Resource> | null;
}

export const listResourceStore = <Resource extends ApiResource>(resource: string) => {
  const initialState: ListStoreState<Resource> = {
    loading: false,
    error: null,
    retrieved: null,
  };

  const { subscribe, set } = writable<ListStoreState<Resource>>(initialState);

  return {
    subscribe,
    reset() {
      set(initialState);
    },
    async list(page = resource) {
      const abortController = new AbortController();

      set({ loading: true, error: null, retrieved: null });
      loadingOverlay.start(abortController, "Loading resources...");

      try {
        const { json } = await fetchApi(page, { signal: abortController.signal });

        set({ loading: false, error: null, retrieved: json as PagedCollection<Resource> });
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") {
          set({ loading: false, error: null, retrieved: null });
          return null;
        }

        set({ loading: false, error: e as TError, retrieved: null });
        throw e;
      } finally {
        loadingOverlay.stop();
      }
    },
  };
};

export default listResourceStore;