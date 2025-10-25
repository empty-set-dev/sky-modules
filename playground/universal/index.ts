import '#setup'

import UniversalReactAppLauncher from '@sky-modules/react/UniversalReactAppLauncher'

import App from './App'

await startRuntime()
new UniversalReactAppLauncher(App)
