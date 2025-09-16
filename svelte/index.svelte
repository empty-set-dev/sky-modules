<script context="module" lang="ts">
  import type { SvelteComponent } from "svelte";

  export interface JSXNode {
    type: string | typeof SvelteComponent | Function;
    props?: Record<string, any>;
    children?: JSXNode[] | JSXNode | string;
    key?: string | number | null;
  }
</script>

<script lang="ts">
  export let node: JSXNode;

  // Render children helper
  function renderChildren(children: any) {
    if (!children) return '';
    if (typeof children === "string") return children;
    if (Array.isArray(children)) return children;
    return [children];
  }

  // Get props without children
  function getCleanProps(node: JSXNode) {
    if (!node.props) return {};
    const { children, ...restProps } = node.props;
    return restProps;
  }

  // Determine node type and get render data
  $: nodeType = typeof node === "string" ? 'text'
    : node?.type === "Fragment" || (typeof node?.type === "function" && node.type.name === "Fragment") ? 'fragment'
    : typeof node?.type === "string" ? 'element'
    : typeof node?.type === "function" ? 'component'
    : 'unknown';

  $: children = node && typeof node !== "string" ? (node.children || node.props?.children) : null;
  $: cleanProps = node && typeof node !== "string" ? getCleanProps(node) : {};
  $: processedChildren = renderChildren(children);
</script>

<!-- Render based on node type -->
{#if nodeType === 'text'}
  {node}
{:else if nodeType === 'fragment'}
  {#if Array.isArray(processedChildren)}
    {#each processedChildren as child, index (child?.key || index)}
      <svelte:self node={child} />
    {/each}
  {:else if processedChildren}
    <svelte:self node={processedChildren} />
  {/if}
{:else if nodeType === 'element'}
  <svelte:element this={node.type} {...cleanProps}>
    {#if typeof processedChildren === 'string'}
      {processedChildren}
    {:else if Array.isArray(processedChildren)}
      {#each processedChildren as child, index (child?.key || index)}
        <svelte:self node={child} />
      {/each}
    {:else if processedChildren}
      <svelte:self node={processedChildren} />
    {/if}
  </svelte:element>
{:else if nodeType === 'component'}
  {#if typeof node.type === 'function'}
    {@const result = node.type(node.props || {})}
    <svelte:self node={result} />
  {/if}
{/if}