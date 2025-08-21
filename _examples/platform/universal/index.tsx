import '#/imports'
import 'defines/sky'

import { createRoot } from 'react-dom/client'

import App from './App'

import './index.scss'

const app = new App()

createRoot(document.getElementById('root')!).render(app.render())
