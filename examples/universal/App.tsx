import '#/imports'

import Foo from './components/Foo'

@define('sky.examples.universal.App')
export default class App {
    @bind
    render = function App(this: App): ReactNode {
        return <Foo />
    }
}
