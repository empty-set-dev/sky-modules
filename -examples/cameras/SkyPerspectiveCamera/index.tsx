import 'sky/-examples/cameras/SkyPerspectiveCamera/imports'

import { createRoot } from 'react-dom/client'

import App from 'sky/-examples/cameras/SkyPerspectiveCamera/App'

const app = await new App()

createRoot(document.getElementById('root')!).render(<app.UI />)
