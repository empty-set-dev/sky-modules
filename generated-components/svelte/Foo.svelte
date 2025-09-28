<script lang="ts">
  export let foo;
  export let onClick;
  export let className;
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

  function increment() {
    count++;
  }

  let count = foo || 0;
</script>

<div
  style={stringifyStyles({
    padding: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
  })}
  on:click={(event) => {
    increment();
    onClick?.();
  }}
  class={className}
>
  <h3>Universal Foo Component</h3>
  <p>Initial value: {foo}</p>
  <p>Current count: {count}</p>
  <button
    on:click={(event) => {
      increment();
    }}
  >
    Increment
  </button>
</div>