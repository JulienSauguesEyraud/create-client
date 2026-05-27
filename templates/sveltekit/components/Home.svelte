<script lang="ts">
  const resourceName = "{{name}}";
  const resourceTitle = "{{{title}}}";
</script>

<section class="hero">
  <h1>{resourceTitle} client</h1>
  <p>This generated SvelteKit app is ready. Use the shared navigation or start from the list page.</p>
  <p>
    <a href={`/${resourceName}`} class="btn btn-primary">Browse {resourceTitle}</a>
  </p>
</section>