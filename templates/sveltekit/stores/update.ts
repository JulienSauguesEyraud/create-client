import { writable } from "svelte/store";
import { fetchApi } from "./fetch";
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
      set({ loading: true, error: null, retrieved: null, updated: null, deleted: null });

      try {
        const { json } = await fetchApi(id);
        const retrieved = json as Resource;

        set({ loading: false, error: null, retrieved, updated: null, deleted: null });

        return retrieved;
      } catch (e) {
        set({ loading: false, error: e as TError, retrieved: null, updated: null, deleted: null });
        throw e;
      }
    },
    async update(item: Resource, values: Partial<Resource>) {
      set({ loading: true, error: null, retrieved: item, updated: null, deleted: null });

      try {
        const { json } = await fetchApi((item as { "@id": string })["@id"], {
          method: "PUT",
          body: JSON.stringify(values),
        });

        const updated = json as Resource;

        set({ loading: false, error: null, retrieved: item, updated, deleted: null });

        return updated;
      } catch (e) {
        set({ loading: false, error: e as TError, retrieved: item, updated: null, deleted: null });
        throw e;
      }
    },
    async del(item: Resource) {
      set({ loading: true, error: null, retrieved: item, updated: null, deleted: null });

      try {
        await fetchApi((item as { "@id": string })["@id"], { method: "DELETE" });

        set({ loading: false, error: null, retrieved: item, updated: null, deleted: item });

        return item;
      } catch (e) {
        set({ loading: false, error: e as TError, retrieved: item, updated: null, deleted: null });
        throw e;
      }
    },
  };
};

export default updateResourceStore;