<script lang="ts">
  import {onMount} from 'svelte/internal';
  import SaveLinkForm from './SaveLinkForm.svelte';
  import Fa from 'svelte-fa';
  import {faGear} from '@fortawesome/free-solid-svg-icons';

  const APP_URL = import.meta.env.VITE_APP_URL as string;

  let accessToken = '';
  let accessTokenInput = '';

  let customAPIURL: string | null = null;
  let customAPIURLInput = '';
  let showSaveURLError = false;

  let showSettings = false;

  const toggleSettings = () => {
    showSettings = !showSettings;
  };

  const clearToken = () => {
    chrome.storage.sync.remove('lsToken');

    accessToken = undefined;
    showSettings = false;
  };
  const isValidHttpUrl = (input: string): boolean => {
    let url;

    try {
      url = new URL(input);
    } catch (_) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
  };

  const saveURL = async () => {
    // Unsetting a custom URL
    if (customAPIURLInput == null || customAPIURLInput === '') {
      customAPIURL = null;
      await chrome.storage.sync.remove('customAPIURL');
      showSaveURLError = false;
      showSettings = false;
      return;
    }
    // Setting a custom URL
    if (
      customAPIURLInput != null &&
      customAPIURLInput !== '' &&
      isValidHttpUrl(customAPIURLInput)
    ) {
      customAPIURL = customAPIURLInput;
      await chrome.storage.sync.set({customAPIURL});
      showSaveURLError = false;
      showSettings = false;
      return;
    } else {
      showSaveURLError = true;
    }
  };

  onMount(() => {
    chrome.storage.sync.get('lsToken').then((data) => {
      accessToken = data.lsToken;
    });
    chrome.storage.sync.get('customAPIURL').then((data) => {
      if (data.customAPIURL) {
        customAPIURL = data.customAPIURL;
        customAPIURLInput = data.customAPIURL;
      }
    });
  });

  function handleSubmit() {
    chrome.storage.sync.set({lsToken: accessTokenInput});

    accessToken = accessTokenInput;
  }
</script>

<!-- markup (zero or more items) goes here -->
<div
  class="flex flex-wrap space-y-2 flex-col justify-items-start p-4 container"
>
  <div class="flex flex-wrap justify-between">
    <h2 class="text-lg">LinkStowr</h2>
    {#if accessToken && accessToken !== ''}
      <button
        class="btn"
        on:click={toggleSettings}
        aria-label="Toggle Settings"
      >
        <Fa icon={faGear} />
      </button>{/if}
  </div>
  {#if !accessToken || accessToken === ''}
    <div class="space-y-2" />
    <p>
      To get started, get an access token by creating an account at <a
        href={APP_URL}
        target="_blank">{APP_URL}</a
      >
    </p>
    <form
      class="flex flex-wrap space-y-2 flex-col justify-items-start"
      on:submit={handleSubmit}
    >
      <label class="label">
        <span>Access Token</span>
        <input
          class="input"
          type="text"
          bind:value={accessTokenInput}
          placeholder="lshelf_XXXXXX_XXXXXXXXXXX"
        />
      </label>
      <button
        class="btn variant-filled"
        type="submit"
        disabled={accessTokenInput == null || accessTokenInput === ''}
        >Save</button
      >
    </form>
  {:else if showSettings}
    <div class="flex flex-col justify-center align-center">
      <button class="btn variant-filled-primary" on:click={clearToken}
        >Clear Token</button
      >
      <form class="mt-8" on:submit|preventDefault={saveURL}>
        <label class="label">
          <span>Custom Server URL:</span>
          <input
            class="input"
            type="url"
            placeholder="Custom Server URL"
            bind:value={customAPIURLInput}
          />
        </label>
        <p class="mb-2">
          Use this if you are self-hosting your own instance of the LinkStowr
          API.
        </p>
        <button class="btn variant-filled w-full" type="submit">Save URL</button
        >
        {#if showSaveURLError}
          <p class="text-red-700">
            Please enter a valid URL or clear the input to remove the custom
            URL.
          </p>
        {/if}
      </form>
    </div>
  {:else}
    <SaveLinkForm {customAPIURL} {accessToken} />
  {/if}
</div>

<style>
  /* your styles go here */
  .container {
    width: 360px;
  }
</style>
