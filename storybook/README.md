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
| `stories/` | The stories, per component and per stack. |
| `.storybook/backbone.ts` | Builds the environment Backbone components expect and loads them with RequireJS. |
| `.storybook/preview-head.html` | Loads `less.js` and the app styling. |

The real app styling is compiled in the browser, so a story takes a moment to appear the first time.

## Adding a component

Each component has a folder with one file per stack, so it shows up as `Common/RenameDialog/Backbone` and `Common/RenameDialog/Vue`. Storybook uses the Vue renderer for both.

| File | Purpose |
|---|---|
| `stories/<folder>/<name>/backbone.stories.ts` | Load the component with `loadBackbone` in `loaders`, and pass separate lists when a view needs another module to be there first. Open it the way the real caller does, and close it again in `beforeEach`. |
| `stories/<folder>/<name>/vue.stories.ts` | Import the `.vue` file. Components that use `EoDialog` also need `loadBackbone()`, because `EoDialog` reports to `Common.NotificationCenter`. |
| `stories/<folder>/<name>/shared.ts` | What both variants share, such as the controls and play functions. |

Use the same story names in both files, so you can compare them.
