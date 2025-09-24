/** @jsxImportSource sky/jsx */
export default class Foo {
    render = (): JSX.Element => <ecs:Entity>123</ecs:Entity>
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'ecs:Entity': {}
        }
    }
}
