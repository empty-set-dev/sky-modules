import '#/imports'

import { Window } from '@tauri-apps/api/window'
import { createRoot } from 'react-dom/client'
import { Text, View } from 'react-native'

const appWindow = new Window('theUniqueLabel')

appWindow.once('tauri://created', function () {
    // window successfully created
})
appWindow.once('tauri://error', function (e) {
    // an error happened creating the window
})

// emit an event to the backend
await appWindow.emit('some-event', 'data')
// listen to an event from the backend
const unlisten = await appWindow.listen('event-name', e => {})
unlisten()

@singleton
@define('sky.examples.projects.game.App')
export default class App {
    static singleton: App
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
