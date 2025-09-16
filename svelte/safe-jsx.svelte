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

  function processNode(n: any): any {
    // Handle strings
    if (typeof n === "string") {
      return { type: 'text', value: n };
    }

    // Handle null/undefined
    if (!n) {
      return { type: 'empty' };
    }

    // Handle Fragment
    if (n.type === "Fragment") {
      const children = n.children || n.props?.children;
      return {
        type: 'fragment',
        children: Array.isArray(children) ? children : children ? [children] : []
      };
    }

    // Handle function components
    if (typeof n.type === "function") {
      const result = n.type(n.props || {});
      return processNode(result);
    }

    // Handle HTML elements
    if (typeof n.type === "string") {
      const children = n.children || n.props?.children;
      const { children: _, ...props } = n.props || {};
      return {
        type: 'element',
        tag: n.type,
        props,
        children: children
      };
    }

    return { type: 'empty' };
  }

  $: processed = processNode(node);
</script>

{#if processed.type === 'text'}
{processed.value}
{:else if processed.type === 'fragment'}
{#each processed.children as child, i (child?.key || i)}
<svelte:self node={child} />
{/each}
{:else if processed.type === 'element'}
<svelte:element this={processed.tag} {...processed.props}>
{#if typeof processed.children === 'string'}
{processed.children}
{:else if Array.isArray(processed.children)}
{#each processed.children as child, i (child?.key || i)}
<svelte:self node={child} />
{/each}
{:else if processed.children}
<svelte:self node={processed.children} />
{/if}
</svelte:element>
{/if}