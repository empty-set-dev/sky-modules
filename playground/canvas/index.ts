import '#/setup'

import UniversalCanvasAppLauncher from '@sky-modules/canvas/core/UniversalCanvasAppLauncher'

import App from './App'

await startRuntime()
new UniversalCanvasAppLauncher(App)
