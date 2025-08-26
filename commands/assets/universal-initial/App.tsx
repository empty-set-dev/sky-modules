import '#/imports'

import { createRoot } from 'react-dom/client'
import { Text, View } from 'react-native'

declare global {
    const app: App
}

@singleton
@define('')
class App {
    static context = true

    root = new EffectsRoot()

    constructor() {
        const rootElement = document.getElementById('root')

        if (!rootElement) {
            throw Error('root is missing')
        }

        createRoot(rootElement).render(<this.render />)
    }

    render = function AppComponent(): ReactNode {
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
