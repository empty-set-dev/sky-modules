import { View, Text } from 'react-native'

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
            <Text>
                Universal React with <b>Vite</b>, <b>Tauri</b> and <b>Expo</b>
            </Text>
        </View>
    )
}
