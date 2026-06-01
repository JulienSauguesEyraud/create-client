import { writable } from "svelte/store";
import { fetchApi } from "./fetch";
import { loadingOverlay } from "./loadingOverlay";
import type { ApiResource, TError } from "../utils/types";

export interface CreateStoreState<Resource extends ApiResource> {
  loading: boolean;
  error: TError;
  created: Resource | null;
}

export const createResourceStore = <Resource extends ApiResource>(resource: string) => {
  const initialState: CreateStoreState<Resource> = {
    loading: false,
    error: null,
    created: null,
  };

  const { subscribe, set } = writable<CreateStoreState<Resource>>(initialState);

  return {
    subscribe,
    reset() {
      set(initialState);
    },
    async create(values: Partial<Resource>) {
      const abortController = new AbortController();

      set({ loading: true, error: null, created: null });
      loadingOverlay.start(abortController, "Creating resource...");

      try {
        const { json } = await fetchApi(resource, {
          method: "POST",
          body: JSON.stringify(values),
          signal: abortController.signal,
        });

        const created = json as Resource;
        set({ loading: false, error: null, created });

        return created;
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") {
          set({ loading: false, error: null, created: null });
          return null;
        }

        set({ loading: false, error: e as TError, created: null });
        throw e;
      } finally {
        await loadingOverlay.stopAfter(250);
      }
    },
  };
};

export default createResourceStore;