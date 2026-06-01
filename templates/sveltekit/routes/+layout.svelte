<script lang="ts">
  import { onMount } from "svelte";
  import { setAuth } from "../stores";
  import "bootstrap/dist/css/bootstrap.min.css";
  import bootstrapJs from "bootstrap/dist/js/bootstrap.bundle.min.js?url";

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

<svelte:head>
  <link rel="icon" href="/favicon.png" />
  <script src={bootstrapJs}></script>
</svelte:head>

<header class="navbar navbar-expand-lg navbar-dark bg-primary">
  <div class="container-fluid px-3">
    <a class="navbar-brand fw-semibold" href="/">API Platform</a>

    <nav class="navbar-nav" aria-label="Main navigation">
      <a class="nav-link" href="/">Home</a>
    </nav>
  </div>
</header>

<main class="container py-4">
  <slot />
</main>
