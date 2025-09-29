import '#/imports'
import { ReactNode } from 'react'

import Button from './mitosis/react/universal/UI/Button'

@define('sky.examples.universal.App')
export default class App {
    @bind
    render = function App(this: App): ReactNode {
        return (
            <div className={AppRootSx}>
                <Button text="button">Button</Button>
                Hello, world!
            </div>
        )
    }
}

const AppRootSx = 'text-center rounded-lg p-2 mt-4 text-lg font-mono bg-neutral-500 table mx-auto'
