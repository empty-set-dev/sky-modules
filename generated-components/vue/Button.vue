<template>
  <button
    :style="getButtonStyle()"
    @click="async (event) => (disabled ? undefined : onClick)()"
    @mousedown="async (event) => handleMouseDown()"
    @mouseup="async (event) => handleMouseUp()"
    :disabled="disabled"
  >
    <template v-if="loading">
      <span>Loading...</span>
    </template>

    <template v-else>
      <slot name="default || text" />
    </template>
  </button>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "button",

  props: ["disabled", "onClick", "loading", "text"],

  data() {
    return { isPressed: false };
  },

  methods: {
    handleMouseDown() {
      this.isPressed = true;
    },
    handleMouseUp() {
      this.isPressed = false;
    },
  },
});
</script>