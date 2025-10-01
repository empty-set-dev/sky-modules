import '#/imports'
import '@sky-modules/react/Box.global'
import '@sky-modules/design/DesignSystem'
import { ReactNode } from 'react'

import skyBrand from './brand'
import { SXProvider } from './mitosis/design/SX'
import Link from './mitosis/universal/components/Link'

@define('sky.examples.universal.App')
export default class App {
    @bind
    render = function App(this: App): ReactNode {
        return (
            <SXProvider
                brands={{ sky: skyBrand }}
                brand="sky"
                initialMode="light"
                initialPalette="pink"
            >
                <div className={AppRootSx}>
                    <Link underline>Link</Link>
                    Hello, world!
                </div>
            </SXProvider>
        )
    }
}

const AppRootSx = 'text-center rounded-lg p-2 mt-4 text-lg font-mono bg-neutral-500 table mx-auto'
