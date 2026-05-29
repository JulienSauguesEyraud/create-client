import chalk from "chalk";
import handlebars from "handlebars";
import hbhComparison from "handlebars-helpers/lib/comparison.js";
import BaseGenerator from "./BaseGenerator.js";

export default class SvelteKitGenerator extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates("sveltekit/", [
      // app shell
      "app.css",

      // utils
      "utils/dataAccess.ts",
      "utils/sveltekit.ts",
      "utils/types.ts",

      // stores / services
      "stores/create.ts",
      "stores/delete.ts",
      "stores/fetch.ts",
      "stores/index.ts",
      "stores/list.ts",
      "stores/retrieve.ts",
      "stores/update.ts",

      // interfaces
      "interfaces/Collection.ts",
      "interfaces/foo.ts",

      // components
      "components/Home.svelte",
      "components/Layout.svelte",
      "components/foo/Create.svelte",
      "components/foo/Form.svelte",
      "components/foo/index.ts",
      "components/foo/List.svelte",
      "components/foo/Show.svelte",
      "components/foo/type.ts",
      "components/foo/Update.svelte",
      "components/Links.svelte",
      "components/Pagination.svelte",

      // routes
      "routes/+layout.svelte",
      "routes/+layout.ts",
      "routes/+page.svelte",
      "routes/foo/+page.svelte",
      "routes/foo/create/+page.svelte",
      "routes/foo/edit/+page.svelte",
      "routes/foo/show/+page.svelte",
    ]);

    handlebars.registerHelper("compare", hbhComparison.compare);
  }

  help(resource) {
    const titleLc = resource.title.toLowerCase();

    console.log(
      'Code for the "%s" resource type has been generated!',
      resource.title
    );
    console.log("The generated SvelteKit route structure is:");
    console.log(
      chalk.green(`
/
  Layout.svelte
  Home.svelte
/${titleLc}
  List.svelte
/${titleLc}/create
  Create.svelte
/${titleLc}/edit
  Update.svelte
/${titleLc}/show
  Show.svelte
`)
    );
  }

  generate(api, resource, dir) {
    const lc = resource.title.toLowerCase();
    const ucf = this.ucFirst(resource.title);
    const fields = this.parseFields(resource);
    const sourceDir = `${dir}/src`;

    const context = {
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      ucf,
      fields,
      formFields: this.buildFields(fields.filter((f) => !f.readonly)),
      hasRelations: fields.some((field) => field.reference || field.embedded),
      hasManyRelations: fields.some(
        (field) => field.isReferences || field.isEmbeddeds
      ),
      hydraPrefix: this.hydraPrefix,
      title: resource.title,
    };

    // Create directories
    // These directories may already exist
    [
      `${sourceDir}/routes`,
      `${sourceDir}/utils`,
      `${sourceDir}/config`,
      `${sourceDir}/interfaces`,
      `${sourceDir}/routes/${resource.name}`,
      `${sourceDir}/routes/${resource.name}/create`,
      `${sourceDir}/routes/${resource.name}/edit`,
      `${sourceDir}/routes/${resource.name}/show`,
      `${sourceDir}/components/${ucf}`,
      `${sourceDir}/stores`,
    ].forEach((dir) => this.createDir(dir, false));

    [
      // components
      "components/%s/Create.svelte",
      "components/%s/Form.svelte",
      "components/%s/index.ts",
      "components/%s/List.svelte",
      "components/%s/Update.svelte",
      "components/%s/type.ts",
      "components/%s/Show.svelte",
      "components/Links.svelte",
    ].forEach((pattern) =>
      this.createFileFromPattern(pattern, sourceDir, [ucf], context)
    );

    [
      // routes
      "routes/+layout.svelte",
      "routes/+layout.ts",
      "routes/+page.svelte",
      "routes/%s/+page.svelte",
      "routes/%s/create/+page.svelte",
      "routes/%s/edit/+page.svelte",
      "routes/%s/show/+page.svelte",
    ].forEach((pattern) => {
      if (pattern.includes("%s")) {
        this.createFileFromPattern(
          pattern,
          sourceDir,
          [resource.name],
          context
        );
        return;
      }

      this.createFile(pattern, `${sourceDir}/${pattern}`, context, false);
    });
    // interface pattern should be camel cased
    this.createFile(
      "interfaces/foo.ts",
      `${sourceDir}/interfaces/${context.ucf}.ts`,
      context
    );

    // copy with regular name
    [
      // app shell
      "app.css",

      // interfaces
      "interfaces/Collection.ts",

      // components
      "components/Home.svelte",
      "components/Layout.svelte",
      "components/Pagination.svelte",

      // stores / services
      "stores/create.ts",
      "stores/delete.ts",
      "stores/fetch.ts",
      "stores/index.ts",
      "stores/list.ts",
      "stores/retrieve.ts",
      "stores/update.ts",

      // utils
      "utils/dataAccess.ts",
      "utils/sveltekit.ts",
      "utils/types.ts",
    ].forEach((file) =>
      this.createFile(file, `${sourceDir}/${file}`, context, false)
    );

    // API config
    this.createEntrypoint(api.entrypoint, `${sourceDir}/config/entrypoint.ts`);
  }

  getDescription(field) {
    return field.description ? field.description.replace(/"/g, "'") : "";
  }

  parseFields(resource) {
    const writableFieldNames = new Set(
      resource.writableFields.map((field) => field.name)
    );

    const fields = [
      ...resource.writableFields,
      ...resource.readableFields,
    ].reduce((list, field) => {
      if (list[field.name]) {
        return list;
      }

      const isReferences = Boolean(
        field.reference && field.maxCardinality !== 1
      );
      const isEmbeddeds = Boolean(field.embedded && field.maxCardinality !== 1);

      return {
        ...list,
        [field.name]: {
          ...field,
          type: this.getType(field),
          description: this.getDescription(field),
          readonly: !writableFieldNames.has(field.name),
          isReferences,
          isEmbeddeds,
          isRelations: isEmbeddeds || isReferences,
        },
      };
    }, {});

    return Object.values(fields);
  }

  ucFirst(target) {
    return target.charAt(0).toUpperCase() + target.slice(1);
  }
}
