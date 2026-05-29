<script lang="ts">
  import { page } from "$app/stores";
  import Links from "../Links.svelte";
  import Pagination from "../Pagination.svelte";
  import { listResourceStore } from "../../stores";
  import {
    decodeRouteParam,
    toResourceCreatePath,
    toResourceEditPath,
    toResourceShowPath,
  } from "../../utils/sveltekit";
  import type { PagedCollection } from "../../interfaces/Collection";
  import type TResource from "./type";
  import type { TError } from "../../utils/types";

  let {
    resourcePath = "{{name}}",
    resourceName = "{{name}}",
    resourceTitle = "{{{title}}}",
  }: {
    resourcePath?: string;
    resourceName?: string;
    resourceTitle?: string;
  } = $props();

  const resource = listResourceStore<TResource>(resourcePath);
  const load = async (pageUrl = resourcePath) => {
    await resource.list(pageUrl);
  };

  const pageParam = $derived(
    decodeRouteParam($page.url.searchParams.get("page") ?? undefined)
  );
  const success = $derived($page.url.searchParams.get("success"));
  const successMessage = $derived(
    success === "deleted" ? "Resource deleted successfully." : null
  );
  const currentPage = $derived(pageParam || resourcePath);
  const items = $derived(
    ($resource.retrieved && $resource.retrieved["{{hydraPrefix}}member"]) || []
  );

  $effect(() => {
    if (currentPage) {
    void load(currentPage);
    }
  });
</script>

<div class="detail">
  <h1>{resourceTitle} List</h1>

  {#if $resource.loading}
    <div class="alert alert-info">Loading...</div>
  {/if}
  {#if $resource.error}
    <div class="alert alert-danger">{$resource.error.message}</div>
  {/if}
  {#if successMessage}
    <div class="alert alert-success" role="status">{successMessage}</div>
  {/if}

  <div class="action-buttons mb-3">
    <a href={toResourceCreatePath(resourceName)}  class="btn btn-success" role="button">Create</a>
  </div>

  <table class="table table-striped">
    <thead>
      <tr class="table-primary">
        <th scope="col">id</th>
        {{#each fields}}
          <th scope="col">{{name}}</th>
        {{/each}}
        <th scope="col" colSpan={2} />
      </tr>
    </thead>
    <tbody>
      {#each items as item (item["@id"])}
        <tr>
          <th scope="row">
            <a href={toResourceShowPath(resourceName, item["@id"] as string)}>{item["@id"]}</a>
          </th>
          {{#each fields}}
            <td>
              {{#if isReferences}}
                <Links items={item['{{{name}}}']} basePath="/{{{reference.name}}}/show?id=" />
              {{else if reference}}
                <Links items={item["{{{name}}}"] as string} basePath="/{{{reference.name}}}/show?id=" />
              {{else if isEmbeddeds}}
                <Links items={item["{{{name}}}"]} basePath="/{{{embedded.name}}}/show?id=" />
              {{else if embedded}}
                <Links items={item["{{{name}}}"]} basePath="/{{{embedded.name}}}/show?id=" />
              {{else}}
                {item['{{{name}}}']}
              {{/if}}
            </td>
          {{/each}}
          <td>
            <a href={toResourceShowPath(resourceName, item["@id"] as string)}  class="btn btn-info" role="button">
              <span class="fa fa-search" aria-hidden="true" />
              <span class="sr-only">Show</span>
            </a>
          </td>
          <td>
            <a href={toResourceEditPath(resourceName, item["@id"] as string)}  class="btn btn-warning" role="button">
              <span class="fa fa-pencil" aria-hidden="true" />
              <span class="sr-only">Edit</span>
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <Pagination retrieved={$resource.retrieved} currentPage={pageParam} />
</div>
