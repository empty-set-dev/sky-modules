import '#/imports'
import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import { ReactNode } from 'react'

import { SXProvider } from './mitosis/design/SX'
import Link from './mitosis/universal/Link'

@define('sky.examples.universal.App')
export default class App {
    @bind
    render = function App(this: App): ReactNode {
        return (
            <SXProvider brand="universal-example-brand" initialTheme="light" initialPalette="pink">
                <Box>
                    <Link underline subtle asChild>
                        <button>Link style, button behavior</button>
                    </Link>
                    Hello, world!
                </Box>
            </SXProvider>
        )
    }
}
