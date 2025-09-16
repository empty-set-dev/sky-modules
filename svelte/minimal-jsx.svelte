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

  function render(n: JSXNode): any {
    if (typeof n === "string") return n;

    if (n?.type === "Fragment") {
      const children = n.children || n.props?.children;
      return Array.isArray(children) ? children : children ? [children] : [];
    }

    if (typeof n?.type === "function") {
      return render(n.type(n.props || {}));
    }

    return n;
  }

  $: rendered = render(node);
  $: isArray = Array.isArray(rendered);
  $: isString = typeof rendered === 'string';
  $: isElement = !isArray && !isString && rendered?.type && typeof rendered.type === 'string';
  $: children = isElement ? (rendered.children || rendered.props?.children) : null;
  $: props = isElement && rendered.props ? (() => {
    const { children, ...rest } = rendered.props;
    return rest;
  })() : {};
</script>

{#if isString}
{rendered}
{:else if isArray}
{#each rendered as item, i (item?.key || i)}
<svelte:self node={item} />
{/each}
{:else if isElement}
<svelte:element this={rendered.type} {...props}>
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
{/if}