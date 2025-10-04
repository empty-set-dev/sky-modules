import RcColorPicker, { ColorPickerProps } from '@rc-component/color-picker'
import '@rc-component/color-picker/assets/index.css'
import { RefAttributes, JSX } from 'react'

const ColorPicker = forwardRef(function ColorPicker<
    T extends JSX.IntrinsicAttributes & ColorPickerProps & RefAttributes<HTMLDivElement>,
>(props: T, ref: Ref<HTMLDivElement>): ReactNode {
    return <RcColorPicker ref={ref} {...props} />
})
export default ColorPicker
