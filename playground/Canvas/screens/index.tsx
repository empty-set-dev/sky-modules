import '@sky-modules/canvas/jsx.global'

import { RectGeometry, BasicMaterial, Mesh } from '@sky-modules/Canvas/jsx'
import { createSignal, JSX } from 'sky-jsx'

@define('sky.playground.Canvas.index_page.Foo')
class Foo {
    @number x = 0

    constructor() {
        setInterval(() => {
            this.x = this.x + 1
            console.log(this.x)
        }, 500)
    }
}

const foo = new Foo()

export default function IndexScreen(): JSX.Element {
    return (
        <>
            <Mesh position={[200, foo.x]}>
                <BasicMaterial color="#FF99FF" />
                <RectGeometry width={100} height={100} />
            </Mesh>
        </>
    )
}
