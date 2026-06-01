import { writable } from "svelte/store";
import { fetchApi } from "./fetch";
import { loadingOverlay } from "./loadingOverlay";
import type { ApiResource, TError } from "../utils/types";

export interface RetrieveStoreState<Resource extends ApiResource> {
  loading: boolean;
  error: TError;
  retrieved: Resource | null;
  deleted: Resource | null;
}

export const retrieveResourceStore = <Resource extends ApiResource>() => {
  const initialState: RetrieveStoreState<Resource> = {
    loading: false,
    error: null,
    retrieved: null,
    deleted: null,
  };

  const { subscribe, set } = writable<RetrieveStoreState<Resource>>(initialState);

  return {
    subscribe,
    reset() {
      set(initialState);
    },
    async retrieve(id: string) {
      const abortController = new AbortController();

      set({ loading: true, error: null, retrieved: null, deleted: null });
      loadingOverlay.start(abortController, "Loading resource...");

      try {
        const { json } = await fetchApi(id, { signal: abortController.signal });
        const retrieved = json as Resource;

        set({ loading: false, error: null, retrieved, deleted: null });

        return retrieved;
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") {
          set({ loading: false, error: null, retrieved: null, deleted: null });
          return null;
        }

        set({ loading: false, error: e as TError, retrieved: null, deleted: null });
        throw e;
      } finally {
        await loadingOverlay.stopAfter(250);
      }
    },
    async del(item: Resource) {
      const abortController = new AbortController();

      set({ loading: true, error: null, retrieved: item, deleted: null });
      loadingOverlay.start(abortController, "Deleting resource...");

      try {
        await fetchApi((item as { "@id": string })["@id"], {
          method: "DELETE",
          signal: abortController.signal,
        });

        set({ loading: false, error: null, retrieved: item, deleted: item });

        return item;
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") {
          set({ loading: false, error: null, retrieved: item, deleted: null });
          return null;
        }

        set({ loading: false, error: e as TError, retrieved: item, deleted: null });
        throw e;
      } finally {
        await loadingOverlay.stopAfter(250);
      }
    },
  };
};

export default retrieveResourceStore;