import '#setup'

import UniversalCanvasAppLauncher from '@sky-modules/Canvas/UniversalCanvasAppLauncher'

import App from './App'

await startRuntime()
new UniversalCanvasAppLauncher(App)
