import '#/imports'

import { Text, View } from 'react-native'

import * as styles from './App.scss'
styles

@define('{{APP_ID}}.App')
@Singleton
export default class App {
    root = new EffectsRoot()

    render = function App(): ReactNode {
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
