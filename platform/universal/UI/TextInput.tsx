import { TextInput as NativeTextInput, TextInputProps } from 'react-native'

export default function TextInput(props: TextInputProps) {
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
        ...(defaultProps.style as any),
        ...(props.style as any),
    }

    return <NativeTextInput {...defaultProps} {...props} style={style} />
}
