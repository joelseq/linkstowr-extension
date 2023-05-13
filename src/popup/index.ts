// Your selected Skeleton theme:
import '@skeletonlabs/skeleton/themes/theme-crimson.css';

// This contains the bulk of Skeletons required styles:
// NOTE: this will be renamed skeleton.css in the v2.x release.
import '@skeletonlabs/skeleton/styles/skeleton.css';
import Popup from 'src/components/Popup.svelte'
import '../app.css'

const target = document.getElementById("app")

function render() {
  new Popup({target})
}

document.addEventListener('DOMContentLoaded', render)
