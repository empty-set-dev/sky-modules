<script lang="ts">
  export let hoverable;
  export let onClick;
  export let className;
  export let image;
  export let title;
  export let subtitle;

  function stringifyStyles(stylesObj) {
    let styles = "";
    for (let key in stylesObj) {
      const dashedKey = key.replace(/[A-Z]/g, function (match) {
        return "-" + match.toLowerCase();
      });
      styles += dashedKey + ":" + stylesObj[key] + ";";
    }
    return styles;
  }

  function handleMouseEnter() {
    if (hoverable) {
      isHovered = true;
    }
  }
  function handleMouseLeave() {
    if (hoverable) {
      isHovered = false;
    }
  }

  let isHovered = false;
</script>

<div
  style={stringifyStyles(cardStyle)}
  on:mouseenter={(event) => {
    handleMouseEnter();
  }}
  on:mouseleave={(event) => {
    handleMouseLeave();
  }}
  on:click={(event) => {
    onClick();
  }}
  class={className}
>
  {#if image}
    <img
      style={stringifyStyles(imageStyle)}
      src={image}
      alt={title || "Card image"}
    />
  {/if}
  {#if title}
    <h3 style={stringifyStyles(titleStyle)}>{title}</h3>
  {/if}
  {#if subtitle}
    <p style={stringifyStyles(subtitleStyle)}>{subtitle}</p>
  {/if}
  {#if $$slots.default}
    <div><slot /></div>
  {/if}
</div>