import { createRoot } from 'react-dom/client'

import App from './App'

isRuntime = true
await runtime

const app = getSingleton(App)

const rootElement = document.getElementById('root')

if (!rootElement) {
    throw Error('root is missing')
}

createRoot(rootElement).render(<app.render />)
