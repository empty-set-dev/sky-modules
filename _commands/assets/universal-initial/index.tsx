import '#/imports'

import { createRoot } from 'react-dom/client'

import App from './App'

import './index.scss'

const app = new App()

const rootElement = document.getElementById('root')

if (!rootElement) {
    throw Error('root is missing')
}

createRoot(rootElement).render(app.render())
