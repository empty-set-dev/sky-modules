import '@sky-modules/react/Box.global'
import '@sky-modules/jsx/global'

declare global {
    namespace DesignSystem {
        type SlotProps<
            T = 'div',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            S extends (props: any) => Mitosis.Node = any,
            M = void,
        > = BoxProps<T> &
            Exclude<Parameters<S>[0], undefined> & {
                unstyled?: undefined | boolean
                styles?: undefined | S
                machine?: undefined | M
            }
    }
}
