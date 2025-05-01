import Select from 'pkgs/react-native-input-select'
import { View, Text } from 'react-native'
import Button from 'sky/platform/universal/UI/Button'
import TextInput from 'sky/platform/universal/UI/TextInput'

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

    const [country, setCountry] = useState()

    return (
        <View
            style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Button title="Test" />
            <TextInput />
            <Text style={{ color: 'inherit' }}>
                Universal React with <b>Vite</b>, <b>Tauri</b> and <b>Expo</b>
            </Text>
            <Select
                label="Country"
                placeholder="Select an option..."
                options={[
                    { label: 'Nigeria', value: 'NG' },
                    { label: 'Åland Islands', value: 'AX' },
                    { label: 'Algeria', value: 'DZ' },
                    { label: 'American Samoa', value: 'AS' },
                    { label: 'Andorra', value: 'AD' },
                ]}
                selectedValue={country}
                onValueChange={value => setCountry(value as never)}
                primaryColor={'green'}
            />
        </View>
    )
}
