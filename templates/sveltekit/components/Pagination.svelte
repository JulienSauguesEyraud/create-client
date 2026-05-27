<script lang="ts">
  import type { PagedCollection } from "../interfaces/Collection";

  let {
    retrieved = null,
    currentPage = null,
  }: {
    retrieved?: PagedCollection<any> | null;
    currentPage?: string | null;
  } = $props();

  const toPageHref = (value: string) => `?page=${encodeURIComponent(value)}`;

  const view = $derived(retrieved && retrieved["{{hydraPrefix}}view"]);
  const rootHref = $derived(currentPage ? "." : ".");
  const firstHref = $derived(rootHref);
  const previousHref = $derived(
    view
      ? !view["{{hydraPrefix}}previous"] ||
        view["{{hydraPrefix}}previous"] === view["{{hydraPrefix}}first"]
        ? rootHref
        : toPageHref(view["{{hydraPrefix}}previous"] as string)
      : "#"
  );
  const nextHref = $derived(
    view && view["{{hydraPrefix}}next"]
      ? toPageHref(view["{{hydraPrefix}}next"] as string)
      : "#"
  );
  const lastHref = $derived(
    view && view["{{hydraPrefix}}last"]
      ? toPageHref(view["{{hydraPrefix}}last"] as string)
      : "#"
  );
</script>

{#if view}
  <nav aria-label="Page navigation">
    <a
      href={view["{{hydraPrefix}}previous"] ? firstHref : "#"}
      class:disabled={!view["{{hydraPrefix}}previous"]}
      class="btn btn-primary"
      aria-label="First page"
    >
      <span aria-hidden="true">&lArr;</span> First
    </a>
    <a
      href={previousHref}
      class:disabled={!view["{{hydraPrefix}}previous"]}
      class="btn btn-primary"
      aria-label="Previous page"
    >
      <span aria-hidden="true">&larr;</span> Previous
    </a>
    <a
      href={nextHref}
      class:disabled={!view["{{hydraPrefix}}next"]}
      class="btn btn-primary"
      aria-label="Next page"
    >
      Next <span aria-hidden="true">&rarr;</span>
    </a>
    <a
      href={lastHref}
      class:disabled={!view["{{hydraPrefix}}next"]}
      class="btn btn-primary"
      aria-label="Last page"
    >
      Last <span aria-hidden="true">&rArr;</span>
    </a>
  </nav>
{/if}
