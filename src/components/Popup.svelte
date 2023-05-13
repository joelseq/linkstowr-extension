<script lang="ts">
	import axios from 'axios';

	let linkNote: string = '';
	let success: boolean = false;

	function handleClick() {
		console.log('Button was clicked!');
		chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
			const currentUrl = tabs[0].url;
			console.log({currentUrl});

			const response = await axios.post('http://localhost:8080/api/clips', {
				url: currentUrl,
				note: linkNote,
			});

			console.log({response});

			if (response.data?.result) {
				success = true;
			}
		});
	}
</script>

<!-- markup (zero or more items) goes here -->
<div class="flex flex-wrap space-y-2 flex-col justify-items-start p-4 container">
	<h2 class="text-lg">OmniClipper</h2>
	<textarea
		class="textarea"
		rows="4"
		placeholder="(Optional) Add some notes about the link."
		bind:value={linkNote}
	/>
	<button type="button" class="btn variant-filled" on:click={handleClick} disabled={success}>
		{success ? 'Success!' : 'Save'}
	</button>
</div>

<style>
	/* your styles go here */
	.container {
		width: 360px;
	}
</style>
