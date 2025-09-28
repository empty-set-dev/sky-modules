import { $, Fragment, component$, h, useStore } from "@builder.io/qwik";

export const handleMouseDown = function handleMouseDown(props, state) {
  state.isPressed = true;
};
export const handleMouseUp = function handleMouseUp(props, state) {
  state.isPressed = false;
};
export const Button = component$((props: any) => {
  const state = useStore<any>({ isPressed: false });

  return (
    <button
      style={getButtonStyle()}
      onClick$={$((event) => (props.disabled ? undefined : props.onClick)())}
      onMouseDown$={$((event) => handleMouseDown(props, state))}
      onMouseUp$={$((event) => handleMouseUp(props, state))}
      disabled={props.disabled}
    >
      {props.loading ? (
        <span>Loading...</span>
      ) : (
        <>{props.children || props.text}</>
      )}
    </button>
  );
});

export default Button;
