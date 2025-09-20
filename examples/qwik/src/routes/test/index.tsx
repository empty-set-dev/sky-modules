import { $, component$, JSXOutput } from "@builder.io/qwik"
import Box from "sky/qwik/Box"

export default component$(() => {
    return <Box as={Foo} sx="bg-blue-500 text-white p-4 rounded-lg" some="123">test</Box>
})

const Foo = $(function Foo(props: {some: string}): JSXOutput {
    return <div {...props}>{props.some}</div>
})
