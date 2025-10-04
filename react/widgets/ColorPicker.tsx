import RcColorPicker, { ColorPickerProps } from '@rc-component/color-picker'
import '@rc-component/color-picker/assets/index.css'
import { RefAttributes, JSX } from 'react'

const ColorPicker = forwardRef(function ColorPicker<
    T extends JSX.IntrinsicAttributes & ColorPickerProps & RefAttributes<HTMLDivElement>,
>(props: T): ReactNode {
    return <RcColorPicker {...props} />
})
export default ColorPicker
