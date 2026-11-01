# Storybook

Shows single components outside the editor, without `sdkjs` or a document server. The stories run on the source code, so no build is needed.

## Running

```bash
cd storybook
npm install
npm run storybook
```

Check the types with `npm run typecheck`.

Open http://localhost:6006. PhpStorm has a `Storybook` run configuration for this.

## Structure

| Path | Purpose |
|---|---|
| `stories/` | The stories, in the same folders as `test/playwright/tests`. |
| `.storybook/backbone.ts` | Builds the environment Backbone components expect and loads them with RequireJS. |
| `.storybook/preview-head.html` | Loads `less.js` and the app styling. |

The real app styling is compiled in the browser, so a story takes a moment to appear the first time.

## Adding a Backbone component

1. Create `stories/<folder>/<name>.stories.ts`.
2. Load the component with `loadBackbone` in `loaders`. Pass separate lists when a view needs another module to be there first.
3. Open it the way the real caller does, and close it again in `beforeEach`.
