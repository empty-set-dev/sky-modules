<template>
  <div
    :style="cardStyle"
    @mouseenter="async (event) => handleMouseEnter()"
    @mouseleave="async (event) => handleMouseLeave()"
    @click="async (event) => onClick()"
    :class="className"
  >
    <template v-if="image">
      <img :src="image" :alt="title || 'Card image'" :style="imageStyle" />
    </template>

    <template v-if="title">
      <h3 :style="titleStyle">{{ title }}</h3>
    </template>

    <template v-if="subtitle">
      <p :style="subtitleStyle">{{ subtitle }}</p>
    </template>

    <template v-if="$slots.default">
      <div><slot /></div>
    </template>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "card",

  props: ["hoverable", "onClick", "className", "image", "title", "subtitle"],

  data() {
    return { isHovered: false };
  },

  methods: {
    handleMouseEnter() {
      if (this.hoverable) {
        this.isHovered = true;
      }
    },
    handleMouseLeave() {
      if (this.hoverable) {
        this.isHovered = false;
      }
    },
  },
});
</script>