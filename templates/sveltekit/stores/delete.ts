import { writable } from "svelte/store";
import { fetchApi } from "./fetch";
import { loadingOverlay } from "./loadingOverlay";
import type { ApiResource, TError } from "../utils/types";

export interface DeleteStoreState<Resource extends ApiResource> {
  loading: boolean;
  error: TError;
  deleted: Resource | null;
}

export const deleteResourceStore = <Resource extends ApiResource>() => {
  const initialState: DeleteStoreState<Resource> = {
    loading: false,
    error: null,
    deleted: null,
  };

  const { subscribe, set } = writable<DeleteStoreState<Resource>>(initialState);

  return {
    subscribe,
    reset() {
      set(initialState);
    },
    async del(item: Resource) {
      const abortController = new AbortController();

      set({ loading: true, error: null, deleted: null });
      loadingOverlay.start(abortController, "Deleting resource...");

      try {
        await fetchApi((item as { "@id": string })["@id"], {
          method: "DELETE",
          signal: abortController.signal,
        });

        set({ loading: false, error: null, deleted: item });

        return item;
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") {
          set({ loading: false, error: null, deleted: null });
          return null;
        }

        set({ loading: false, error: e as TError, deleted: null });
        throw e;
      } finally {
        loadingOverlay.stop();
      }
    },
  };
};

export default deleteResourceStore;