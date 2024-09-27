import 'examples/cameras/SkyPerspectiveCamera/imports'

import { createRoot } from 'react-dom/client'

import App from './App'

const app = await new App()

createRoot(document.getElementById('root')!).render(<app.UI />)
