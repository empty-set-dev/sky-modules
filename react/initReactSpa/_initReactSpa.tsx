import App from '#/App'

import ReactSpa from '../ReactSpa'

function getReactSpaApp(): ReactSpa.App {
    const app: Partial<ReactSpa.App> = getSingleton(App)

    if (app.render == null) {
        throw Error('Init React SPA: no render in App')
    }

    extends_type<ReactSpa.App>(app)
    return app
}

@singleton
export default class InitReactSpa {
    readonly reactSpa: ReactSpa

    constructor() {
        this.reactSpa = getReactSpaApp()
    }
}
