import { writable } from "svelte/store";
import { fetchApi } from "./fetch";
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
      set({ loading: true, error: null, created: null });

      try {
        const { json } = await fetchApi(resource, {
          method: "POST",
          body: JSON.stringify(values),
        });

        const created = json as Resource;
        set({ loading: false, error: null, created });

        return created;
      } catch (e) {
        set({ loading: false, error: e as TError, created: null });
        throw e;
      }
    },
  };
};

export default createResourceStore;