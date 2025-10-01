import '@sky-modules/react/Box.global'
import '@sky-modules/jsx/global'

declare global {
    namespace DesignSystem {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type SlotProps<T extends BoxAs, S extends (props: any) => any> = BoxProps<T> &
            Exclude<Parameters<S>[0], undefined>
    }
}
