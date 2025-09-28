import { createSignal, createMemo } from "solid-js";

function Foo(props: any) {
  const [count, setCount] = createSignal(props.foo || 0);

  function increment() {
    count()++;
  }

  return (
    <>
      <div
        class={props.className}
        onClick={(event) => {
          increment();
          props.onClick?.();
        }}
        style={{
          padding: "16px",
          border: "1px solid #ccc",
          "border-radius": "8px",
          cursor: "pointer",
          "background-color": "#f9f9f9",
        }}
      >
        <h3>Universal Foo Component</h3>
        <p>
          Initial value:
          {props.foo}
        </p>
        <p>
          Current count:
          {count()}
        </p>
        <button onClick={(event) => increment()}>Increment</button>
      </div>
    </>
  );
}

export default Foo;
