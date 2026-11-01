# Playwright component tests

Safety net for the migration from Backbone to Vue (phase 0). These tests run a single component in an empty page, without the editor, `sdkjs` or a document server. They test behaviour, so the same spec will later check the Vue version too.

Full flows with a real document belong in the e2e suite of the DocumentServer repo (`.github/workflows/e2e.yml`).

## Running

```bash
cd test/playwright
npm install
npx playwright install chromium
npm test
```

Use `npm run test:ui` to step through a test.

## Structure

| Path | Purpose |
|---|---|
| `tests/` | The specs. They don't know which framework a component uses. |
| `tests/support/harness.ts` | Loads and opens a component from a spec. |
| `harness/bootstrap.js` | Loads the vendor libraries and the environment components expect. |
| `harness/adapters/` | One per component: opens it and publishes `window.harness.open(options)`. |

`http-server` serves the `web-apps` root, so the tests run on the source code and need no build.

## Adding a component

1. Create `harness/adapters/<name>.js`. The promise from `open` resolves when the component is done, with the result the caller would also get.
2. Create `tests/<folder>/<name>.spec.ts` and use `loadComponent` and `openComponent`.

## Moving to Vue

Components that moved to Vue stay behind the `eo-vue-islands` flag in `localStorage`, next to their Backbone version. The `show` method of the Backbone view picks one, so the harness adapter doesn't change.

Every spec runs twice: the `backbone` project with the flag off and the `vue` project with the flag on. Use `--project=vue` to run one of them. Playwright builds the Vue islands before it starts.

A green spec doesn't prove everything. `toBeVisible` passes for an element with `opacity: 0`, and the page has no editor around it. Also check the dialog in the real editor.

So look things up in specs by what a user sees, such as `getByRole` and text, not by Backbone classes or ids such as `.modal-dlg` or `#id-dlg-newname`.

## What you see

The harness shows only the component, with the real app styling: `less.js` compiles `app.less` in the browser, like the dev version of the editor. The rest of the editor is deliberately absent, so there is no toolbar and no document.

In UI mode a dialog closes at the end of the test. Click an earlier step in the list to see it.

The visual baselines from the migration plan are not included here yet.
