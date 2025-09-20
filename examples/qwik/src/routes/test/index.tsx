import { component$ } from "@builder.io/qwik"
import Box from "sky/qwik/Box"
import styles from './index.module.css'

export default component$(() => {
    return <Box as="section" sx="bg-blue-500 text-white p-4 rounded-lg" class={styles.foo}>test</Box>
})

