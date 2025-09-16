import { Button as ReactNativeButton, ButtonProps } from 'react-native'

export default function Button(props: ButtonProps): ReactNode {
    const defaultProps: Partial<ButtonProps> = {
        color: '#000000',
    }

    return <ReactNativeButton {...defaultProps} {...props} />
}
