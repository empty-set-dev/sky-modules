import NativeSelect, { DropdownSelect } from 'pkgs/react-native-input-select'

import { View } from './View'

export default function Select(props: Parameters<typeof NativeSelect>[0]): ReactNode {
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
