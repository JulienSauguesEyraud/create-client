<script lang="ts">
  import { onMount } from "svelte";
  import { setAuth } from "../stores";
  import "../app.css";

  const authStorageKey = "api-platform-auth";
  const authEventName = "api-platform-auth-changed";

  const asAuthHeader = (token: string | null) => (token ? `Bearer ${token}` : "");

  const syncAuth = (token: string | null) => {
    setAuth(asAuthHeader(token));
  };

  onMount(() => {
    syncAuth(localStorage.getItem(authStorageKey));

    const onStorage = (event: StorageEvent) => {
      if (event.key === authStorageKey) {
        syncAuth(event.newValue);
      }
    };

    const onAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ token?: string | null }>;
      syncAuth(customEvent.detail?.token ?? null);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(authEventName, onAuthChange as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(authEventName, onAuthChange as EventListener);
    };
  });
</script>

<div class="app-shell">
  <header class="app-header">
    <a class="app-brand" href="/">API Platform</a>

    <nav class="app-nav" aria-label="Main navigation">
      <a href="/">Home</a>
    </nav>
  </header>

  <main class="app-content">
    <slot />
  </main>
</div>