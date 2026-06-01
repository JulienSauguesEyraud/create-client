import { writable } from "svelte/store";

export interface LoadingOverlayState {
  visible: boolean;
  message: string;
}

export interface LoadingOverlayStore {
  subscribe: (run: (value: LoadingOverlayState) => void) => () => void;
  start: (controller: AbortController, message?: string) => void;
  stop: () => void;
  stopAfter: (delayMs: number) => Promise<void>;
  abort: () => void;
}

const initialState: LoadingOverlayState = {
  visible: false,
  message: "Loading...",
};

let activeController: AbortController | null = null;

const { subscribe, set } = writable<LoadingOverlayState>(initialState);

const start = (controller: AbortController, message = "Loading...") => {
  activeController = controller;
  set({ visible: true, message });
};

const stop = () => {
  activeController = null;
  set(initialState);
};

const stopAfter = async (delayMs: number) => {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  stop();
};

const abort = () => {
  activeController?.abort();
  stop();
};

export const loadingOverlayStore: LoadingOverlayStore = {
  subscribe,
  start,
  stop,
  stopAfter,
  abort,
};

export const loadingOverlay: LoadingOverlayStore = loadingOverlayStore;

export default loadingOverlayStore;