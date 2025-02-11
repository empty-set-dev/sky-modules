import { View, Text } from 'react-native'

export default class App extends EffectsRoot {
    static context = true

    constructor() {
        super()
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
