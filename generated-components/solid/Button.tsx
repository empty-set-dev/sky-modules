import { Show, createSignal, createMemo } from "solid-js";

function Button(props: any) {
  const [isPressed, setIsPressed] = createSignal(false);

  function handleMouseDown() {
    setIsPressed(true);
  }

  function handleMouseUp() {
    setIsPressed(false);
  }

  return (
    <>
      <button
        style={getButtonStyle()}
        onClick={(event) => (props.disabled ? undefined : props.onClick)()}
        onMouseDown={(event) => handleMouseDown()}
        onMouseUp={(event) => handleMouseUp()}
        disabled={props.disabled}
      >
        <Show fallback={props.children || props.text} when={props.loading}>
          <span>Loading...</span>
        </Show>
      </button>
    </>
  );
}

export default Button;
