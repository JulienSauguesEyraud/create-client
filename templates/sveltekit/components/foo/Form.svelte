<script lang="ts">
{{#if hasManyRelations}}  import { normalizeLinks } from "../../utils/dataAccess";{{/if}}
  import type TResource from "./type";
  import type { TError } from "../../utils/types";

  let {
    onSubmit = () => undefined,
    initialValues = {},
    error = null,
  }: {
    onSubmit?: (item: Partial<TResource>) => any;
    initialValues?: Partial<TResource>;
    error?: TError;
  } = $props();

  let values: Record<string, any> = {
{{#each formFields}}
  {{{name}}}: initialValues["{{name}}"]
  {{#if isEmbeddeds}}?.map((emb: any) => emb["@id"]).join(",") ?? ""
  {{else if isReferences}}?.join(",") ?? ""
  {{else if embedded}}?.["@id"] ?? ""
  {{else if reference}} ?? ""
  {{else}} ?? ""{{/if}},
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

  const toNumberValue = (value: string) => (value === "" ? undefined : Number(value));
</script>

<form class="mb-3" on:submit|preventDefault={handleSubmit}>
{{#each formFields}}
{{#if (compare type "==" "checkbox")}}
  <div class="form-check mb-3">
    <input
      id="{{{name}}}"
      class="form-check-input"
      type="checkbox"
      {{#if required}}required{{/if}}
      checked={Boolean(values["{{{name}}}"])}
      on:change={(event) => values["{{{name}}}"] = (event.currentTarget as HTMLInputElement).checked}
    />
    <label class="form-check-label" for="{{{name}}}">{{{name}}}</label>
  </div>
{{else}}
  <div class="form-floating mb-3">
    <input
      id="{{{name}}}"
      class="form-control"
      placeholder="{{{description}}}"
      type="{{{type}}}"
      {{#if step}}step="{{{step}}}"{{/if}}
      {{#if required}}required{{/if}}
{{#if number}}
      value={values["{{{name}}}"]}
      on:input={(event) => values["{{{name}}}"] = toNumberValue((event.currentTarget as HTMLInputElement).value)}
{{else}}
      value={values["{{{name}}}"]}
      on:input={(event) => values["{{{name}}}"] = (event.currentTarget as HTMLInputElement).value}
{{/if}}
    />
    <label for="{{{name}}}">{{{name}}}</label>
  </div>
{{/if}}
{{/each}}

  {#if error}
    <div class="alert alert-danger" role="alert">{error.message}</div>
  {/if}

  <button type="submit" class="btn btn-secondary">Submit</button>
</form>
