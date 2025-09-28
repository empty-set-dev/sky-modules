<template>
  <div
    @click="
      async (event) => {
        increment();
        onClick?.();
      }
    "
    :style="{
      padding: '16px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      cursor: 'pointer',
      backgroundColor: '#f9f9f9',
    }"
    :class="className"
  >
    <h3>Universal Foo Component</h3>
    <p>Initial value: {{ foo }}</p>
    <p>Current count: {{ count }}</p>
    <button @click="async (event) => increment()">Increment</button>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "foo",

  props: ["foo", "onClick", "className"],

  data() {
    return { count: this.foo || 0 };
  },

  methods: {
    increment() {
      this.count++;
    },
  },
});
</script>