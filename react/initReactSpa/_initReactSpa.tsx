import App from '#/App'

import ReactSpa from '../ReactSpa'

@singleton
export default class InitReactSpa extends ReactSpa {
    constructor() {
        const app = getSingleton(App)
        extends_type<{ render?: FC }>(app)

        if (app.render == null) {
            throw Error('Init React SPA: no render in App')
        }

        extends_type<{ render: FC }>(app)
        super(app)
    }
}
