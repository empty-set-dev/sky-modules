import { createRoot } from 'react-dom/client'
import { iAm } from 'sky/standard/modules'
iAm('ReactSpa', import('./ReactSpa'))

declare global {
    interface Modules {
        ReactSpa: typeof import('./ReactSpa')
    }
}

namespace ReactSpa {
    export interface App {
        render: FC
    }
}

class ReactSpa {
    constructor(app: ReactSpa.App) {
        const rootElement = document.getElementById('root')

        if (!rootElement) {
            throw Error('root is missing')
        }

        createRoot(rootElement).render(<app.render />)
    }
}

export default ReactSpa
