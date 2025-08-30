import '#/imports'
import App from '#/App'

import '#/imports'
import { AboutPage } from './AboutPage'

export default function About(): ReactNode {
    const app = getSingleton(App)
    console.log(app)
    return <AboutPage />
}
