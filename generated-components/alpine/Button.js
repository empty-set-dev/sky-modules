<button
  x-data="button()"
  x-bind:style="getButtonStyle()"
  x-on:click="(disabled ? undefined : onClick)()"
  x-on:mouse-down="handleMouseDown()"
  x-on:mouse-up="handleMouseUp()"
  x-bind:disabled="disabled"
>
  <template x-if="loading">
    <span>Loading...</span>
  </template>
</button>
<script>
  document.addEventListener("alpine:init", () => {
    Alpine.data("button", () => ({
      isPressed: false,
      handleMouseDown() {
        this.isPressed = true;
      },
      handleMouseUp() {
        this.isPressed = false;
      },
    }));
  });
</script>
