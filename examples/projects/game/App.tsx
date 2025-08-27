import '#/imports'

import { createRoot } from 'react-dom/client'
import { Text, View } from 'react-native'

@define('sky.examples.projects.game.App')
@singleton
export default class App {
    static readonly singleton = 'app'
    static context = true

    root = new EffectsRoot()

    constructor() {
        const rootElement = document.getElementById('root')

        if (!rootElement) {
            throw Error('root is missing')
        }

        createRoot(rootElement).render(<this.view />)
    }

    view = function AppView(): ReactNode {
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: 'inherit' }}>
                    Universal React with <b>Vite</b>, <b>Tauri</b> and <b>Expo</b>
                </Text>
            </View>
        )
    }
}

global.isRuntime = true
