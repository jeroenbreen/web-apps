// Builds the environment the Backbone components expect, without the editor or
// a document server. Same setup as test/playwright/harness/bootstrap.js.
declare const require: {
  (modules: string[], onLoad: (...modules: any[]) => void, onError: (error: Error) => void): void
  config(options: object): void
}
declare const less: { pageLoadFinished: Promise<unknown> }

const globals = window as any

function load(modules: string[]) {
  return new Promise<any[]>((resolve, reject) => {
    require(modules, (...loaded) => resolve(loaded), reject)
  })
}

// Loaded here and not in preview-head.html: Storybook's own scripts include a UMD
// module that RequireJS would otherwise claim as an anonymous define().
function loadRequireJs() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/vendor/requirejs/require.js'
    script.onload = () => resolve()
    script.onerror = reject
    document.head.append(script)
  })
}

async function setUp() {
  await loadRequireJs()

  require.config({
    baseUrl: '/apps/',
    paths: {
      jquery: '../vendor/jquery/jquery.min',
      underscore: '../vendor/underscore/underscore',
      backbone: '../vendor/backbone/backbone',
      tip: 'common/main/lib/util/Tip',
    },
    shim: {
      backbone: { deps: ['underscore', 'jquery'], exports: 'Backbone' },
      underscore: { exports: '_' },
    },
  })

  const [$, _, Backbone] = await load(['jquery', 'underscore', 'backbone'])

  // The app modules read these as globals.
  globals.$ = globals.jQuery = $
  globals._ = _
  globals.Backbone = Backbone

  // Ambient state the components read at render time. The real modules would
  // pull in 'core' and the application bootstrap.
  const Common = (globals.Common = globals.Common ?? {})
  Common.UI = Common.UI ?? {}
  Common.Views = Common.Views ?? {}
  Common.UI.Scaling = { currentRatio: () => 1 }
  Common.Controllers = { Desktop: { isActive: () => false } }
  Common.Locale = {
    getCurrentLanguage: () => 'en',
    isCurrentLanguageRtl: () => false,
  }
  Common.NotificationCenter = _.extend({}, Backbone.Events)

  // The app loads these up front: Tip extends the jQuery plugin from
  // mods/tooltip, and an EventBus adds fireEvent to every Backbone.View.
  await load(['common/main/lib/core/application', 'common/main/lib/mods/tooltip'])
  new Backbone.EventBus()

  await less.pageLoadFinished
}

let ready: Promise<void> | undefined

// Pass one list per step when a view needs another module to be there first:
// many views use Common.UI.Window without declaring it as a dependency.
export async function loadBackbone(...steps: string[][]) {
  ready ??= setUp()
  await ready
  for (const modules of steps) await load(modules)
}
