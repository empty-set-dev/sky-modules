<div
  x-data="card()"
  x-bind:style="cardStyle"
  x-on:mouse-enter="handleMouseEnter()"
  x-on:mouse-leave="handleMouseLeave()"
  x-on:click="onClick()"
  x-bind:class="className"
>
  <template x-if="image">
    <img
      x-bind:src="image"
      x-bind:alt="title || 'Card image'"
      x-bind:style="imageStyle"
    />
  </template>
  <template x-if="title">
    <h3 x-bind:style="titleStyle"><span x-html="title"></span></h3>
  </template>
  <template x-if="subtitle">
    <p x-bind:style="subtitleStyle"><span x-html="subtitle"></span></p>
  </template>
  <template x-if="children">
    <div><span x-html="children"></span></div>
  </template>
</div>
<script>
  document.addEventListener("alpine:init", () => {
    Alpine.data("card", () => ({
      isHovered: false,
      handleMouseEnter() {
        if (props.hoverable) {
          this.isHovered = true;
        }
      },
      handleMouseLeave() {
        if (props.hoverable) {
          this.isHovered = false;
        }
      },
    }));
  });
</script>
