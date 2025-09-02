import { createRoot } from 'react-dom/client'

assert(App, )

@singleton
export default class ReactSpa {
    constructor() {
        const app = getSingleton(App)

        const rootElement = document.getElementById('root')

        if (!rootElement) {
            throw Error('root is missing')
        }

        createRoot(rootElement).render(<app.render />)
    }
}
