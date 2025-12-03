import globalify from '@sky-modules/core/globalify'

import Container, * as imports from '../Container.lite'

declare global {
    const Container: typeof imports.default
    type Container = typeof imports.default
    type ContainerProps<T extends BoxAs = 'div'> = imports.ContainerProps<T>
}

globalify({ Container })
