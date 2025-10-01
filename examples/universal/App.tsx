import '#/imports'
import '@sky-modules/react/Box.global'
import '@sky-modules/design/DesignSystem'

import { ReactNode } from 'react'

import { SXProvider } from './mitosis/design/SX'
import Link from './mitosis/universal/Link'

@define('sky.examples.universal.App')
export default class App {
    @bind
    render = function App(this: App): ReactNode {
        return (
            <SXProvider brand="universal-example-brand" initialTheme="light" initialPalette="pink">
                <div className={AppRootSx}>
                    <Link underline href="https://google.com">Link</Link>
                    Hello, world!
                </div>
            </SXProvider>
        )
    }
}

const AppRootSx =
    'text-[var(--brand-400)] text-center rounded-lg p-2 mt-4 text-lg font-mono bg-neutral-500 table mx-auto'
