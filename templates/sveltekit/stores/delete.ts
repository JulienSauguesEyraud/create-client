import { writable } from "svelte/store";
import { fetchApi } from "./fetch";
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
      set({ loading: true, error: null, deleted: null });

      try {
        await fetchApi((item as { "@id": string })["@id"], { method: "DELETE" });

        set({ loading: false, error: null, deleted: item });

        return item;
      } catch (e) {
        set({ loading: false, error: e as TError, deleted: null });
        throw e;
      }
    },
  };
};

export default deleteResourceStore;