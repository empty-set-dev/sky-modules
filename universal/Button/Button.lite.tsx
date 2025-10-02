import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { buttonRecipe } from './Button.recipe.lite'

export default function Button<T extends TagName = 'button'>(
    props: Design.SlotProps<T, typeof buttonRecipe>
): Mitosis.Node {
    const { variant, size, disabled, loading, unstyled, recipe, as, ...restProps } = props
    const styles = recipe ?? buttonRecipe({ variant, size, disabled, loading })
    const buttonRef = useRef(null)
    return (
        <Box
            ref={buttonRef}
            {...restProps}
            as={as ?? ('button' as T)}
            disabled={disabled}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {loading && <span className="button__loading">⏳</span>}
            {props.children}
        </Box>
    )
}