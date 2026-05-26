import { writable } from "svelte/store";
import { fetchApi } from "./fetch";
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
      set({ loading: true, error: null, retrieved: null });

      try {
        const { json } = await fetchApi(page);

        set({ loading: false, error: null, retrieved: json as PagedCollection<Resource> });
      } catch (e) {
        set({ loading: false, error: e as TError, retrieved: null });
        throw e;
      }
    },
  };
};

export default listResourceStore;