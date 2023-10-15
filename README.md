# LinkStowr Extension

This is the repo for the Chrome Extension for [Obsidian LinkStowr](https://github.com/joelseq/obsidian-linkstowr).

## Development

Install dependencies:
```
npm install
```

OR

```
pnpm install
```

### Start the local development server for the extension

```
npm run dev
```

OR

```
pnpm dev
```

This will create a `dist/` folder with the contents of the extension which you can load unpacked into a Chromium based browser.

### To run the test suite

To run it once:
```
pnpm test
```

To run it in watch mode:
```
pnpm test:watch
```

### Production build

To get a production bundled version of the extension:

```
pnpm build
```

If you would like a zipped version of the extension, you can run:
```
pnpm pre:publish
```
This will create a zip of the extension and place it in the `out/` directory.
