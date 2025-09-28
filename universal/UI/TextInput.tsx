import { TextInput as NativeTextInput, TextInputProps } from 'react-native'

export default function TextInput(props: TextInputProps): ReactNode {
    const defaultProps: Partial<TextInputProps> = {
        style: {
            height: 40,
            color: 'white',
            borderColor: 'white',
            borderWidth: 1,
            padding: 20,
            outlineColor: 'transparent',
        },
    }

    const style = {
        ...(defaultProps.style as object),
        ...(props.style as object),
    }

    return <NativeTextInput {...defaultProps} {...props} style={style} />
}
