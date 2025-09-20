import { component$ } from "@builder.io/qwik"
import styles from './scss.module.scss'

export default component$(() => {
    return <div class={styles.div}>SCSS div</div>
})

