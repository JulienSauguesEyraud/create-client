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

  export let resourcePath = "{{name}}";
  export let resourceName = "{{name}}";
  export let resourceTitle = "{{{title}}}";

  const resource = listResourceStore<TResource>(resourcePath);
  let currentPage = resourcePath;
  let pageParam: string | null = null;

  const load = async (pageUrl = resourcePath) => {
    await resource.list(pageUrl);
  };

  $: pageParam = decodeRouteParam($page.params.page);
  $: currentPage = pageParam || resourcePath;
  $: if (currentPage) {
    void load(currentPage);
  }

  $: items = ($resource.retrieved && $resource.retrieved["{{hydraPrefix}}member"]) || [];
</script>

<div>
  <h1>{resourceTitle} List</h1>

  {#if $resource.loading}
    <div class="alert alert-info">Loading...</div>
  {/if}
  {#if $resource.error}
    <div class="alert alert-danger">{$resource.error.message}</div>
  {/if}

  <p>
    <a href={toResourceCreatePath(resourceName)} class="btn btn-primary">Create</a>
  </p>

  <table class="table table-responsive table-striped table-hover">
    <thead>
      <tr>
        <th>id</th>
        {{#each fields}}
          <th>{{name}}</th>
        {{/each}}
        <th colSpan={2} />
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
                <Links items={item['{{{name}}}']} basePath="/{{{reference.name}}}/show/" />
              {{else if reference}}
                <Links items={item["{{{name}}}"] as string} basePath="/{{{reference.name}}}/show/" />
              {{else if isEmbeddeds}}
                <Links items={item["{{{name}}}"]} basePath="/{{{embedded.name}}}/show/" />
              {{else if embedded}}
                <Links items={item["{{{name}}}"]} basePath="/{{{embedded.name}}}/show/" />
              {{else}}
                {item['{{{name}}}']}
              {{/if}}
            </td>
          {{/each}}
          <td>
            <a href={toResourceShowPath(resourceName, item["@id"] as string)}>
              <span class="fa fa-search" aria-hidden="true" />
              <span class="sr-only">Show</span>
            </a>
          </td>
          <td>
            <a href={toResourceEditPath(resourceName, item["@id"] as string)}>
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
