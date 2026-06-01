<script lang="ts">
  import { loadingOverlay } from "../stores";

  const close = () => {
    loadingOverlay.abort();
  };
</script>

{#if $loadingOverlay.visible}
  <div
    class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
    role="dialog"
    aria-modal="true"
    aria-labelledby="loading-overlay"
    style="z-index: 1080;"
  >
    <div
      class="position-absolute top-0 start-0 w-100 h-100 bg-opacity-50"
      aria-hidden="true"
      style="backdrop-filter: blur(10px);"
    />

    <div class="modal-dialog modal-dialog-centered m-0 position-relative" role="status" aria-live="polite">
      <div class="modal-content shadow-lg rounded-4 text-center position-relative px-4 py-5">
        <button
          type="button"
          class="btn-close position-absolute top-0 end-0 m-3"
          on:click={close}
          aria-label="Close loading overlay"
        />

        <div class="spinner-border text-primary mx-auto" role="status" aria-hidden="true">
          <span class="visually-hidden">Loading...</span>
        </div>

        <p id="loading-overlay-title" class="mb-0 fs-5 fw-semibold">{$loadingOverlay.message}</p>
      </div>
    </div>
  </div>
{/if}