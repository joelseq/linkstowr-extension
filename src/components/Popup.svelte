<script lang="ts">
  import {onMount} from 'svelte';
  import SaveLinkForm from './SaveLinkForm.svelte';
  import Fa from 'svelte-fa';
  import {faGear} from '@fortawesome/free-solid-svg-icons';

  const APP_URL = import.meta.env.VITE_APP_URL as string;

  let accessToken = '';
  let accessTokenInput = '';

  let showSettings = false;

  const toggleSettings = () => {
    showSettings = !showSettings;
  };

  const clearToken = () => {
    chrome.storage.sync.remove('lsToken');

    accessToken = undefined;
    showSettings = false;
  };

  onMount(() => {
    chrome.storage.sync.get('lsToken').then((data) => {
      accessToken = data.lsToken;
    });
  });

  function handleSubmit() {
    chrome.storage.sync.set({lsToken: accessTokenInput});

    accessToken = accessTokenInput;
  }
</script>

<!-- markup (zero or more items) goes here -->
<div
  class="flex flex-wrap space-y-2 flex-col justify-items-start p-4 {showSettings
    ? 'container-sm'
    : 'container'}"
>
  <div class="flex flex-wrap justify-between">
    <h2 class="text-lg">LinkStowr</h2>
    {#if accessToken && accessToken !== ''}
      <button class="btn" on:click={toggleSettings}>
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
    <div class="flex justify-center align-center">
      <button class="btn variant-filled-primary" on:click={clearToken}
        >Clear Token</button
      >
    </div>
  {:else}
    <SaveLinkForm {accessToken} />
  {/if}
</div>

<style>
  /* your styles go here */
  .container {
    width: 360px;
  }

  .container-sm {
    width: 240px;
  }
</style>
