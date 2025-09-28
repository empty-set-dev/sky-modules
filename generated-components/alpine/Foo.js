<div
  x-data="foo()"
  x-on:click="increment();
onClick?.()"
  x-bind:style="{
  padding: '16px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  cursor: 'pointer',
  backgroundColor: '#f9f9f9'
}"
  x-bind:class="className"
>
  <h3>Universal Foo Component</h3>
  <p>
    Initial value:
    <span x-html="foo"></span>
  </p>
  <p>
    Current count:
    <span x-html="count"></span>
  </p>
  <button x-on:click="increment()">Increment</button>
</div>
<script>
  document.addEventListener("alpine:init", () => {
    Alpine.data("foo", () => ({
      count: props.foo || 0,
      increment() {
        this.count++;
      },
    }));
  });
</script>
