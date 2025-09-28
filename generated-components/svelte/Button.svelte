<script lang="ts">
  export let disabled;
  export let onClick;
  export let loading;

  export let text;
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

  function handleMouseDown() {
    isPressed = true;
  }
  function handleMouseUp() {
    isPressed = false;
  }

  let isPressed = false;
</script>

<button
  style={stringifyStyles(getButtonStyle())}
  on:click={(event) => {
    (disabled ? undefined : onClick)();
  }}
  on:mousedown={(event) => {
    handleMouseDown();
  }}
  on:mouseup={(event) => {
    handleMouseUp();
  }}
  {disabled}
>
  {#if loading}
    <span>Loading...</span>
  {:else}
    <slot name="default || text" />
  {/if}</button
>