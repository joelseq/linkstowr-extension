<script lang="ts">
  import {onMount} from 'svelte/internal';
  import {getAPI} from '../utils/api';

  export let customAPIURL: string | null;
  export let accessToken: string;
  let textAreaInput: HTMLTextAreaElement;

  let title = '';
  let linkNote: string = '';
  let success: boolean = false;
  const baseAPIURL =
    customAPIURL != null && customAPIURL !== ''
      ? customAPIURL
      : (import.meta.env.VITE_API_URL as string);

  onMount(() => {
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      const currentTabTitle = tabs[0].title;

      if (currentTabTitle && currentTabTitle !== '') {
        title = currentTabTitle;
      }
    });

    textAreaInput.focus();
  });

  function handleSubmit() {
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      const currentUrl = tabs[0].url;
      const api = getAPI(baseAPIURL, accessToken);

      const response = await api.post('/api/links', {
        title,
        url: currentUrl,
        note: linkNote,
      });

      if (response.data?.result) {
        success = true;
        window.close();
      }
    });
  }

  function handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    handleSubmit();
  }

  const textareaAction = (node: HTMLElement) => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        handleSubmit();
      }
    };
    node.addEventListener('keydown', listener);

    return {
      destroy() {
        node.removeEventListener('keydown', listener);
      },
    };
  };
</script>

<!-- markup (zero or more items) goes here -->
<form on:submit={handleFormSubmit}>
  <label class="label">
    <span>Title</span>
    <input class="input" type="text" bind:value={title} />
  </label>
  <label class="label">
    <span>Note</span>
    <textarea
      use:textareaAction
      bind:this={textAreaInput}
      class="textarea"
      rows="4"
      placeholder="(Optional) Add some notes about the link."
      bind:value={linkNote}
    />
  </label>
  <button type="submit" class="btn w-full variant-filled" disabled={success}>
    {success ? 'Success!' : 'Save Link'}
  </button>
</form>

<style>
  /* your styles go here */
</style>
