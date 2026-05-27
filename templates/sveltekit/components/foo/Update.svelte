<script lang="ts">
  import { page } from "$app/stores";
  import Form from "./Form.svelte";
  import { updateResourceStore } from "../../stores";
  import {
    decodeRouteParam,
    redirectToResourcePath,
    toResourcePath,
  } from "../../utils/sveltekit";
  import type TResource from "./type";
  import type { TError } from "../../utils/types";

  const resource = updateResourceStore<TResource>();
  const load = async (id: string) => {
    await resource.retrieve(id);
  };

  const decodedId = $derived(decodeRouteParam($page.url.searchParams.get("id") ?? undefined));

  $effect(() => {
    if (decodedId) {
      void load(decodedId);
    }
  });

  const update = async (values: Partial<TResource>) => {
    if (!$resource.retrieved) {
      return;
    }

    await resource.update($resource.retrieved, values);
  };

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
  <h1>Edit {{{ucf}}} {$resource.retrieved && $resource.retrieved["@id"]}</h1>

  {#if $resource.loading}
    <div class="alert alert-info" role="status">Loading...</div>
  {/if}
  {#if $resource.error}
    <div class="alert alert-danger" role="alert">{$resource.error.message}</div>
  {/if}

  {#if $resource.retrieved}
    <Form onSubmit={update} error={$resource.error} initialValues={$resource.retrieved} />
  {/if}

  <a href={toResourcePath("{{{name}}}")} class="btn btn-primary">Back to list</a>
  <button type="button" on:click={del} class="btn btn-danger">Delete</button>
</div>
