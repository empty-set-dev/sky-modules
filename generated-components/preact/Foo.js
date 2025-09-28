/** @jsx h */
import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

function Foo(props: any) {
  const [count, setCount] = useState(() => props.foo || 0);

  function increment() {
    count++;
  }

  return (
    <div
      onClick={(event) => {
        increment();
        props.onClick?.();
      }}
      style={{
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#f9f9f9",
      }}
      className={props.className}
    >
      <h3>Universal Foo Component</h3>
      <p>Initial value: {props.foo}</p>
      <p>Current count: {count}</p>
      <button onClick={(event) => increment()}>Increment</button>
    </div>
  );
}

export default Foo;
