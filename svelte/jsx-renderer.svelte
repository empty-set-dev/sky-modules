<script context="module" lang="ts">
  export interface JSXNode {
    type: string | Function;
    props?: Record<string, any>;
    children?: JSXNode[] | JSXNode | string;
    key?: string | number | null;
  }
</script>

<script lang="ts">
  export let node: JSXNode;

  $: isString = typeof node === "string";
  $: isFragment = !isString && (node?.type === "Fragment" || (typeof node?.type === "function" && node.type.name === "Fragment"));
  $: isElement = !isString && !isFragment && typeof node?.type === "string";
  $: isComponent = !isString && !isFragment && !isElement && typeof node?.type === "function";
  $: elementTag = isElement ? node.type as string : '';

  $: children = !isString ? (node.children || node.props?.children) : null;
  $: props = !isString && node.props ? (() => {
    const { children, ...rest } = node.props;
    return rest;
  })() : {};
</script>

{#if isString}
{node}
{:else if isFragment}
{#if Array.isArray(children)}
{#each children as child, i (child?.key || i)}
<svelte:self node={child} />
{/each}
{:else if children}
<svelte:self node={children} />
{/if}
{:else if isElement}
<svelte:element this={elementTag} {...props}>
{#if typeof children === 'string'}
{children}
{:else if Array.isArray(children)}
{#each children as child, i (child?.key || i)}
<svelte:self node={child} />
{/each}
{:else if children}
<svelte:self node={children} />
{/if}
</svelte:element>
{:else if isComponent}
{#if typeof node.type === 'function'}
{@const result = node.type(node.props || {})}
<svelte:self node={result} />
{/if}
{/if}