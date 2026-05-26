<script lang="ts">
{{#if hasManyRelations}}  import { normalizeLinks } from "../../utils/dataAccess";{{/if}}
  import type TResource from "./type";
  import type { TError } from "../../utils/types";

  export let onSubmit: (item: Partial<TResource>) => any = () => undefined;
  export let initialValues: Partial<TResource> = {};
  export let error: TError = null;

  let values: Record<string, any> = {
{{#each formFields}}
  {{{name}}}: initialValues["{{name}}"]{{#if isEmbeddeds}}?.map((emb: any) => emb["@id"]).join(",") ?? ""{{else if isReferences}}?.join(",") ?? ""{{else if embedded}}?.["@id"] ?? ""{{else if reference}} ?? ""{{else}} ?? ""{{/if}},
{{/each}}
  };

  const handleSubmit = () => {
    const payload: Record<string, any> = { ...values };

{{#each formFields}}
{{#if isRelations}}
    payload["{{{name}}}"] = normalizeLinks(values["{{{name}}}"]);
{{/if}}
{{/each}}

    onSubmit(payload as Partial<TResource>);
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
{{#each formFields}}
  <div class="form-group">
    <label class="form-label" for="{{{name}}}">{{{name}}}</label>
    <input
      id="{{{name}}}"
      class="form-control"
      placeholder="{{{description}}}"
      type="{{{type}}}"
      {{#if step}}step="{{{step}}}"{{/if}}
      {{#if required}}required{{/if}}
      value={values["{{{name}}}"]}
      on:input={(event) => values["{{{name}}}"] = (event.currentTarget as HTMLInputElement).value}
    />
  </div>
{{/each}}

  {#if error}
    <div class="alert alert-danger" role="alert">{error.message}</div>
  {/if}

  <button type="submit" class="btn btn-success">Submit</button>
</form>
