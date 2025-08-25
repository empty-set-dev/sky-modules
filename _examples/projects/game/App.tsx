import { View } from 'react-native'

export default class App {
    static context = true

    root = new EffectsRoot()

    render(): ReactNode {
        return <AppComponent />
    }
}

function AppComponent(): ReactNode {
    return (
        <View
            style={{
                width: '100%',
                height: '100%',
            }}
        ></View>
    )
}
