import '#setup'

import { Text, View } from 'react-native'

define('{{APP_ID}}.App', App)
export default function App(): ReactNode {
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
