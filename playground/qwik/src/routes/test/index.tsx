import { component$ } from "@builder.io/qwik"
import Box from "sky/qwik/Box"
import '@sky-modules/design/lib/colors.css'
import './test.css'

export default component$(() => {
    return (
        <>
            <Box as="section" sx="text-white p-4 rounded-lg foo-[#FF9900]">test</Box>
            <a href="https://google.com">Google</a>
        </>
    )
})

