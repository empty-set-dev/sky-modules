import '#/imports'

import { createRoot } from 'react-dom/client'
import { View } from 'react-native'

function singleton<T>(target: Class<T>): Class<T> {
    if (!extends_type<Record<string, T>>(global)) {
        return null!
    }

    global[`${target.name[0].toLowerCase()}${target.name.slice(1)}`] = new target() as T
    return target
}

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
