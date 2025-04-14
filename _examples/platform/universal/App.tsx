import { View, Text } from 'react-native'

import { onTest } from './App.telefunc'

export default class App {
    static context = true

    root = new EffectsRoot()

    render(): ReactNode {
        return <AppComponent />
    }
}

function AppComponent(): ReactNode {
    useEffect(() => {
        onTest(42)
    }, [])

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
