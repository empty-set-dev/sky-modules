import '#/imports'

import { createRoot } from 'react-dom/client'
import { View } from 'react-native'
import './long'

declare global {
    const app: App
}

@singleton
@define('sky.examples.projects.game.App')
class App {
    static context = true

    root = new EffectsRoot()

    constructor() {
        const rootElement = document.getElementById('root')

        if (!rootElement) {
            throw Error('root is missing')
        }

        createRoot(rootElement).render(this.render())
    }

    render = function AppComponent(): ReactNode {
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                }}
            ></View>
        )
    }
}
