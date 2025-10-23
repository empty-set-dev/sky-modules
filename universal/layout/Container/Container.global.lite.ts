import globalify from '@sky-modules/core/globalify'

import Container_lite, * as imports from './Container.lite'

declare global {
    const Container_lite: typeof imports.default
    type Container_lite = typeof imports.default
    type ContainerProps = imports.ContainerProps
}

globalify({ Container_lite, ...imports })
