import { $, component$, JSXOutput } from "@builder.io/qwik"
import Box from "sky/qwik/Box"

export default component$(() => {
    return <Box as={Foo} some="123">test</Box>
})

const Foo = $(function Foo(props: {some: string}): JSXOutput {
    return <div>{props.some}</div>
})
