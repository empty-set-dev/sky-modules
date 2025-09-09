import {
    ClassValue,
    createTV,
    TV,
    TVCompoundSlots,
    TVCompoundVariants,
    TVDefaultVariants,
    TVVariants,
} from 'tailwind-variants'

import BooRoot from './Boo.Root'

type TVSlots = Record<string, ClassValue> | undefined

const Styles = createTV({
    twMerge: true,
})

Boo.Root = BooRoot

interface BooProps {}
export default function Boo(props: Parameters<typeof Boo.styles>[0]): ReactNode {
    return (
        <Boo.Root>
            Booooooooooo
            <Boo.Some />
            <Boo.Some2 />
        </Boo.Root>
    )
}

Boo.Some = function BooSome(props: BooVariants): ReactNode {
    const styles = Boo.styles(props).some()
    return <Box sx={styles}>Some</Box>
}

Boo.Some2 = BooSome2
function BooSome2(props: BooVariants & BooSome2Variants): ReactNode {
    const styles = Boo.styles(props).some2()
    const styles2 = BooSome2.styles(props)
    return <Box sx={`${styles} ${styles2}`}>Some</Box>
}
BooSome2.styles = Styles({
    base: 'border-2 border-cyan-300 p-4',
    variants: {
        a: {
            a: 'border-red-600',
            b: 'border-green-600',
        },
    },
})
