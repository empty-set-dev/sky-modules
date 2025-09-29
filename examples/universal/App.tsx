import '#/imports'
import '@sky-modules/react/Box.global'
import '@sky-modules/design/DesignSystem'
import { ReactNode } from 'react'

import Link from './mitosis/react/universal/UI/Link/Link'

@define('sky.examples.universal.App')
export default class App {
    @bind
    render = function App(this: App): ReactNode {
        return (
            <div className={AppRootSx}>
                <Link underline>Link</Link>
                Hello, world!
            </div>
        )
    }
}

const AppRootSx = 'text-center rounded-lg p-2 mt-4 text-lg font-mono bg-neutral-500 table mx-auto'
