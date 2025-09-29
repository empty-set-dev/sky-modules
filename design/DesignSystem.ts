import '@sky-modules/react/Box.global'
import '@sky-modules/jsx/global'

declare global {
    namespace DesignSystem {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type SlotProps<T, S extends (props: any) => any> = BoxProps<T> & {
            children: JSX.Node
        } & Parameters<S>[0]
    }
}
