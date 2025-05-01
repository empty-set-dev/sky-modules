import { StyleSheet } from 'pkgs/react-native'
import NativeSelect, { DropdownSelect } from 'pkgs/react-native-input-select'

import { View } from './View'

export default function Select(props: Parameters<typeof NativeSelect>[0]) {
    const defaultProps: Partial<Parameters<typeof NativeSelect>[0]> = {
        dropdownContainerStyle: {
            width: '30%',
        },
        dropdownStyle: {
            width: '30%',
        },
    }

    //
    return (
        <View style={{ width: 400 }}>
            <DropdownSelect {...defaultProps} {...props} />
        </View>
    )
}

const styles = StyleSheet.create({
    customComponentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    text: {
        marginBottom: 20,
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tinyLogo: {
        width: 20,
        height: 20,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        borderWidth: 3,
        borderColor: 'white',
    },
})
