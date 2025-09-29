import '#/imports'
import { ReactNode } from 'react'

@define('sky.examples.universal.App')
export default class App {
    @bind
    render = function App(this: App): ReactNode {
        return <>Hello, world!</>
    }
}
