type ElementType = keyof HTMLElementTagNameMap | typeof import('svelte').SvelteComponent

interface JSXNode {
    type: ElementType
    props?: Record<string, any>
    children?: JSXNode[] | string
}
