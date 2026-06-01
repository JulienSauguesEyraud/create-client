import { writable } from "svelte/store";
import { fetchApi } from "./fetch";
import { loadingOverlay } from "./loadingOverlay";
import type { ApiResource, TError } from "../utils/types";

export interface UpdateStoreState<Resource extends ApiResource> {
  loading: boolean;
  error: TError;
  retrieved: Resource | null;
  updated: Resource | null;
  deleted: Resource | null;
}

export const updateResourceStore = <Resource extends ApiResource>() => {
  const initialState: UpdateStoreState<Resource> = {
    loading: false,
    error: null,
    retrieved: null,
    updated: null,
    deleted: null,
  };

  const { subscribe, set } = writable<UpdateStoreState<Resource>>(initialState);

  return {
    subscribe,
    reset() {
      set(initialState);
    },
    async retrieve(id: string) {
      const abortController = new AbortController();

      set({ loading: true, error: null, retrieved: null, updated: null, deleted: null });
      loadingOverlay.start(abortController, "Loading resource...");

      try {
        const { json } = await fetchApi(id, { signal: abortController.signal });
        const retrieved = json as Resource;

        set({ loading: false, error: null, retrieved, updated: null, deleted: null });

        return retrieved;
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") {
          set({ loading: false, error: null, retrieved: null, updated: null, deleted: null });
          return null;
        }

        set({ loading: false, error: e as TError, retrieved: null, updated: null, deleted: null });
        throw e;
      } finally {
        loadingOverlay.stop();
      }
    },
    async update(item: Resource, values: Partial<Resource>) {
      const abortController = new AbortController();

      set({ loading: true, error: null, retrieved: item, updated: null, deleted: null });
      loadingOverlay.start(abortController, "Updating resource...");

      try {
        const { json } = await fetchApi((item as { "@id": string })["@id"], {
          method: "PUT",
          body: JSON.stringify(values),
          signal: abortController.signal,
        });

        const updated = json as Resource;

        set({ loading: false, error: null, retrieved: item, updated, deleted: null });

        return updated;
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") {
          set({ loading: false, error: null, retrieved: item, updated: null, deleted: null });
          return null;
        }

        set({ loading: false, error: e as TError, retrieved: item, updated: null, deleted: null });
        throw e;
      } finally {
        loadingOverlay.stop();
      }
    },
    async del(item: Resource) {
      const abortController = new AbortController();

      set({ loading: true, error: null, retrieved: item, updated: null, deleted: null });
      loadingOverlay.start(abortController, "Deleting resource...");

      try {
        await fetchApi((item as { "@id": string })["@id"], {
          method: "DELETE",
          signal: abortController.signal,
        });

        set({ loading: false, error: null, retrieved: item, updated: null, deleted: item });

        return item;
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") {
          set({ loading: false, error: null, retrieved: item, updated: null, deleted: null });
          return null;
        }

        set({ loading: false, error: e as TError, retrieved: item, updated: null, deleted: null });
        throw e;
      } finally {
        loadingOverlay.stop();
      }
    },
  };
};

export default updateResourceStore;