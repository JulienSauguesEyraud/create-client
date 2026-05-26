import { writable } from "svelte/store";
import { fetchApi } from "./fetch";
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
      set({ loading: true, error: null, retrieved: null, deleted: null });

      try {
        const { json } = await fetchApi(id);
        const retrieved = json as Resource;

        set({ loading: false, error: null, retrieved, deleted: null });

        return retrieved;
      } catch (e) {
        set({ loading: false, error: e as TError, retrieved: null, deleted: null });
        throw e;
      }
    },
    async del(item: Resource) {
      set({ loading: true, error: null, retrieved: item, deleted: null });

      try {
        await fetchApi((item as { "@id": string })["@id"], { method: "DELETE" });

        set({ loading: false, error: null, retrieved: item, deleted: item });

        return item;
      } catch (e) {
        set({ loading: false, error: e as TError, retrieved: item, deleted: null });
        throw e;
      }
    },
  };
};

export default retrieveResourceStore;