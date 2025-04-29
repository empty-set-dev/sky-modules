import { Button as NativeButton, ButtonProps } from "react-native";

export default function Button(props: ButtonProps) {
    const defaultProps: Partial<ButtonProps> = {
        color: '#000000',
    }

    //
    return <NativeButton {...defaultProps} {...props}  />
}