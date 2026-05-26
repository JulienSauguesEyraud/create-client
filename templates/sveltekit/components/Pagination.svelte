<script lang="ts">
  import type { PagedCollection } from "../interfaces/Collection";

  export let retrieved: PagedCollection<any> | null = null;
  export let currentPage: string | null = null;

  let view: any = null;
  let rootHref = ".";
  let firstHref = ".";
  let previousHref = ".";
  let nextHref = "#";
  let lastHref = "#";

  $: view = retrieved && retrieved["{{hydraPrefix}}view"];
  $: rootHref = currentPage ? ".." : ".";
  $: firstHref = rootHref;
  $: previousHref = view
    ? !view["{{hydraPrefix}}previous"] ||
      view["{{hydraPrefix}}previous"] === view["{{hydraPrefix}}first"]
      ? rootHref
      : encodeURIComponent(view["{{hydraPrefix}}previous"] as string)
    : "#";
  $: nextHref = view && view["{{hydraPrefix}}next"]
    ? encodeURIComponent(view["{{hydraPrefix}}next"] as string)
    : "#";
  $: lastHref = view && view["{{hydraPrefix}}last"]
    ? encodeURIComponent(view["{{hydraPrefix}}last"] as string)
    : "#";
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
