<script lang="ts">
  import Form from "./Form.svelte";
  import { createResourceStore } from "../../stores";
  import {
    redirectToResourceEditPath,
    toResourcePath,
  } from "../../utils/sveltekit";
  import type TResource from "./type";
  import type { TError } from "../../utils/types";

  let { resourcePath = "{{name}}" }: { resourcePath?: string } = $props();

  const resource = createResourceStore<TResource>(resourcePath);

  const create = async (item: Partial<TResource>) => {
    try {
      await resource.create(item);

      if ($resource.created) {
        await redirectToResourceEditPath(
          resourcePath,
          $resource.created["@id"] as string
        );
      }
    } catch {
      // state is exposed by the store
    }
  };
</script>

<div>
  <h1>Create {{{title}}}</h1>

  {#if $resource.loading}
    <div class="alert alert-info" role="status">Loading...</div>
  {/if}
  {#if $resource.error}
    <div class="alert alert-danger" role="alert">{$resource.error.message}</div>
  {/if}

  <Form onSubmit={create} error={$resource.error} />

  <a href={toResourcePath(resourcePath)} class="btn btn-show">Back to list</a>
</div>
