import { $, Fragment, component$, h, useStore } from "@builder.io/qwik";

export const increment = function increment(props, state) {
  state.count++;
};
export const Foo = component$((props: any) => {
  const state = useStore<any>({ count: props.foo || 0 });

  return (
    <div
      onClick$={$((event) => {
        increment(props, state);
        props.onClick?.();
      })}
      style={{
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#f9f9f9",
      }}
      class={props.className}
    >
      <h3>Universal Foo Component</h3>
      <p>Initial value: {props.foo}</p>
      <p>Current count: {state.count}</p>
      <button onClick$={$((event) => increment(props, state))}>
        Increment
      </button>
    </div>
  );
});

export default Foo;
