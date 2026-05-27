<script lang="ts">
  import { page } from "$app/stores";
  import Links from "../Links.svelte";
  import { retrieveResourceStore } from "../../stores";
  import {
    decodeRouteParam,
    redirectToResourcePath,
    toResourceEditPath,
    toResourcePath,
  } from "../../utils/sveltekit";
  import type TResource from "./type";
  import type { TError } from "../../utils/types";

  const resource = retrieveResourceStore<TResource>();
  const load = async (id: string) => {
    await resource.retrieve(id);
  };

  const decodedId = $derived(decodeRouteParam($page.url.searchParams.get("id") ?? undefined));

  $effect(() => {
    if (decodedId) {
      void load(decodedId);
    }
  });

  const del = async () => {
    if (!$resource.retrieved || !window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    await resource.del($resource.retrieved);

    if ($resource.deleted) {
      await redirectToResourcePath("{{{name}}}");
    }
  };
</script>

<div>
  <h1>Show {{{ucf}}} {$resource.retrieved && $resource.retrieved["@id"]}</h1>

  {#if $resource.loading}
    <div class="alert alert-info" role="status">Loading...</div>
  {/if}
  {#if $resource.error}
    <div class="alert alert-danger" role="alert">{$resource.error.message}</div>
  {/if}

  {#if $resource.retrieved}
    <table class="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {{#each fields}}
          <tr>
            <th scope="row">{{name}}</th>
            <td>
              {{#if isReferences}}
                <Links items={$resource.retrieved['{{{name}}}']} basePath="/{{{reference.name}}}/show?id=" />
              {{else if reference}}
                <Links items={$resource.retrieved["{{{name}}}"] as string} basePath="/{{{reference.name}}}/show?id=" />
              {{else if isEmbeddeds}}
                <Links items={$resource.retrieved["{{{name}}}"]} basePath="/{{{embedded.name}}}/show?id=" />
              {{else if embedded}}
                <Links items={$resource.retrieved["{{{name}}}"]} basePath="/{{{embedded.name}}}/show?id=" />
              {{else}}
                {$resource.retrieved['{{{name}}}']}
              {{/if}}
            </td>
          </tr>
        {{/each}}
      </tbody>
    </table>
  {/if}

  <a href={toResourcePath("{{{name}}}")} class="btn btn-primary">Back to list</a>
  {#if $resource.retrieved}
    <a href={toResourceEditPath("{{{name}}}", $resource.retrieved["@id"] as string)} class="btn btn-warning">Edit</a>
  {/if}
  <button type="button" on:click={del} class="btn btn-danger">Delete</button>
</div>
