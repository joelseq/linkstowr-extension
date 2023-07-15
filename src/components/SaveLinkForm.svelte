<script lang="ts">
  import {onMount} from 'svelte';
  import {getAPI} from '../utils/api';

  export let accessToken: string;

  let title = '';
  let linkNote: string = '';
  let success: boolean = false;

  onMount(() => {
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      const currentTabTitle = tabs[0].title;

      if (currentTabTitle && currentTabTitle !== '') {
        title = currentTabTitle;
      }
    });
  });

  function handleClick() {
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      const currentUrl = tabs[0].url;
      const api = getAPI(accessToken);

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
</script>

<!-- markup (zero or more items) goes here -->
<label class="label">
  <span>Title</span>
  <input class="input" type="text" bind:value={title} />
</label>
<label class="label">
  <span>Note</span>
  <textarea
    class="textarea"
    rows="4"
    placeholder="(Optional) Add some notes about the link."
    bind:value={linkNote}
  />
</label>
<button
  type="submit"
  class="btn variant-filled"
  on:click={handleClick}
  disabled={success}
>
  {success ? 'Success!' : 'Save Link'}
</button>

<style>
  /* your styles go here */
</style>
