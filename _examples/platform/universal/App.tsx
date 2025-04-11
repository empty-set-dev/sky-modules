import { View, Text } from 'react-native'

export default class App {
    static context = true

    readonly root = new EffectsRoot()

    constructor() {
        this.root.addContext(this)
    }

    @bind
    UI(): ReactNode {
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
