import { Api, Field, Resource } from "@api-platform/api-doc-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tmp from "tmp";
import SvelteKitGenerator from "./SvelteKitGenerator.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));

test("Generate SvelteKit resource types with readonly dates and relations", () => {
  const generator = new SvelteKitGenerator({
    templateDirectory: `${dirname}/../../templates`,
  });
  const tmpobj = tmp.dirSync({ unsafeCleanup: true });

  const author = new Resource("author", "http://example.com/authors", {
    title: "Author",
  });
  const category = new Resource("category", "http://example.com/categories", {
    title: "Category",
  });

  const resource = new Resource("book", "http://example.com/books", {
    id: "book",
    title: "Book",
    readableFields: [
      new Field("title", {
        id: "http://schema.org/name",
        range: "http://www.w3.org/2001/XMLSchema#string",
        reference: null,
        required: true,
        description: "Title",
      }),
      new Field("author", {
        id: "http://schema.org/author",
        range: undefined,
        reference: author,
        required: false,
        description: "Author",
      }),
      new Field("categories", {
        id: "http://schema.org/category",
        range: undefined,
        reference: category,
        maxCardinality: 2,
        required: false,
        description: "Categories",
      }),
    ],
    writableFields: [
      new Field("title", {
        id: "http://schema.org/name",
        range: "http://www.w3.org/2001/XMLSchema#string",
        reference: null,
        required: true,
        description: "Title",
      }),
      new Field("publishedAt", {
        id: "http://schema.org/datePublished",
        range: "http://www.w3.org/2001/XMLSchema#dateTime",
        reference: null,
        required: false,
        description: "Published at",
      }),
    ],
  });

  const api = new Api("http://example.com", {
    entrypoint: "http://example.com:8080",
    title: "My API",
    resources: [resource],
  });

  generator.generate(api, resource, tmpobj.name);

  expect(fs.existsSync(tmpobj.name + "/routes/+layout.svelte")).toBe(true);
  expect(fs.existsSync(tmpobj.name + "/routes/+layout.ts")).toBe(true);
  expect(fs.existsSync(tmpobj.name + "/routes/+page.svelte")).toBe(true);
  expect(fs.existsSync(tmpobj.name + "/app.css")).toBe(true);
  expect(fs.existsSync(tmpobj.name + "/utils/sveltekit.ts")).toBe(true);
  expect(fs.existsSync(tmpobj.name + "/interfaces/Book.ts")).toBe(true);

  const layout = fs
    .readFileSync(tmpobj.name + "/routes/+layout.svelte")
    .toString();
  expect(layout).toContain('import { setAuth } from "../stores";');
  expect(layout).toContain('import "../app.css";');
  expect(layout).toContain("api-platform-auth");
  expect(layout).toContain("Main navigation");

  const layoutModule = fs
    .readFileSync(tmpobj.name + "/routes/+layout.ts")
    .toString();
  expect(layoutModule).toContain("export const ssr = false;");
  expect(layoutModule).toContain("export const csr = true;");

  const sveltekitUtils = fs
    .readFileSync(tmpobj.name + "/utils/sveltekit.ts")
    .toString();
  expect(sveltekitUtils).toContain("decodeRouteParam");
  expect(sveltekitUtils).toContain("redirectToResourceEditPath");

  const res = `import type { ApiResource } from "../utils/types";

export interface Book extends ApiResource {
  title?: string;
  publishedAt?: string;
  readonly author?: string[];
  readonly categories?: string[];
}
`;

  expect(fs.readFileSync(tmpobj.name + "/interfaces/Book.ts").toString()).toBe(
    res
  );

  tmpobj.removeCallback();
});
