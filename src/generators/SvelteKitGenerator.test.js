import { Api, Field, Resource } from "@api-platform/api-doc-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import tmp from "tmp";
import SvelteKitGenerator from "./SvelteKitGenerator.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

test("Generate a SvelteKit app", () => {
  const generator = new SvelteKitGenerator({
    templateDirectory: `${dirname}/../../templates`,
  });
  const tmpobj = tmp.dirSync({ unsafeCleanup: true });

  const fields = [
    new Field("bar", {
      id: "http://schema.org/url",
      range: "http://www.w3.org/2001/XMLSchema#string",
      reference: null,
      required: true,
      description: "An URL",
    }),
  ];
  const resource = new Resource("abc", "http://example.com/foos", {
    id: "abc",
    title: "abc",
    readableFields: fields,
    writableFields: fields,
  });
  const api = new Api("http://example.com", {
    entrypoint: "http://example.com:8080",
    title: "My API",
    resources: [resource],
  });

  generator.generate(api, resource, tmpobj.name);
  [
    "/utils/dataAccess.ts",
    "/utils/types.ts",
    "/utils/sveltekit.ts",
    "/config/entrypoint.ts",

    "/interfaces/Abc.ts",
    "/interfaces/Collection.ts",

    "/components/Abc/index.ts",
    "/components/Abc/Create.svelte",
    "/components/Abc/Update.svelte",
    "/components/Abc/Show.svelte",
    "/components/Abc/Form.svelte",
    "/components/Abc/List.svelte",
    "/components/Abc/type.ts",

    "/components/Home.svelte",
    "/components/Layout.svelte",
    "/components/Links.svelte",
    "/components/Pagination.svelte",

    "/routes/+layout.svelte",
    "/routes/+layout.ts",
    "/routes/+page.svelte",
    "/routes/abc/+page.svelte",
    "/routes/abc/create/+page.svelte",
    "/routes/abc/edit/+page.svelte",
    "/routes/abc/show/+page.svelte",

    "/stores/create.ts",
    "/stores/delete.ts",
    "/stores/fetch.ts",
    "/stores/index.ts",
    "/stores/list.ts",
    "/stores/retrieve.ts",
    "/stores/update.ts",
  ].forEach((file) =>
    expect(fs.existsSync(tmpobj.name + "/src" + file)).toBe(true)
  );

  [
    "/components/Abc/Form.svelte",
    "/components/Abc/List.svelte",
    "/components/Abc/Show.svelte",
    "/interfaces/Abc.ts",
  ].forEach((file) => {
    expect(fs.existsSync(tmpobj.name + "/src" + file)).toBe(true);
    expect(fs.readFileSync(tmpobj.name + "/src" + file, "utf8")).toMatch(/bar/);
  });

  tmpobj.removeCallback();
});
