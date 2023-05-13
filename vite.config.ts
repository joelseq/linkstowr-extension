import { crx } from "@crxjs/vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";
import manifest from "./manifest.json";
import postcss from './postcss.config.js'

const srcDir = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte(), crx({ manifest })],
    resolve: {
        alias: {
            src: srcDir,
        },
    },
    css: {
        postcss,
    }
});
