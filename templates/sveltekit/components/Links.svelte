<script lang="ts">
  export type LinkValue = string | { "@id": string; [key: string]: any };

  export let items: LinkValue | LinkValue[];
  export let basePath = "";
  export let labelKey = "@id";

  const getId = (item: LinkValue) =>
    typeof item === "string" ? item : item["@id"];

  const getLabel = (item: LinkValue) =>
    typeof item === "string" ? item : item[labelKey] ?? item["@id"];
</script>

{#if Array.isArray(items)}
  {#each items as item, index (index)}
    <span>
      <a href={`${basePath}${encodeURIComponent(getId(item))}`}>{getLabel(item)}</a>
      {#if index < items.length - 1}
        {", "}
      {/if}
    </span>
  {/each}
{:else}
  <a href={`${basePath}${encodeURIComponent(getId(items))}`}>{getLabel(items)}</a>
{/if}