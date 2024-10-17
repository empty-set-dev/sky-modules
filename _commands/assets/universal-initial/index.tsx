import './index.scss'
import 'sky/standard/global'
import 'sky/helpers/global'
import 'sky/features/asyncConstructor/global'
import 'sky/features/effect/global'

import { createRoot } from 'react-dom/client'

import App from './App'

const app = new App()

createRoot(document.getElementById('root')!).render(<app.UI />)
