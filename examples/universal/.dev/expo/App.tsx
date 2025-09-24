import { Button, Text, View } from 'react-native'
import tw from 'twrnc'

import type { ReactNode } from 'react'

// [ ] Box in ReactNative!

export default function App(): ReactNode {
    return (
        <View style={RootStyle}>
            <Text style={TextStyle}>Hello, world!</Text>
            <Button title="Button" />
        </View>
    )
}

const RootStyle = tw`
    flex-1
    items-center
    justify-center
`

const TextStyle = tw`
    text-2xl
`
