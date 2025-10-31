import '#/setup'

import UniversalCanvasAppLauncher from '@sky-modules/canvas/UniversalCanvasAppLauncher'

import App from './App'

await startRuntime()
new UniversalCanvasAppLauncher(App)
