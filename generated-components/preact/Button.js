/** @jsx h */
import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

function Button(props: any) {
  const [isPressed, setIsPressed] = useState(() => false);

  function handleMouseDown() {
    setIsPressed(true);
  }

  function handleMouseUp() {
    setIsPressed(false);
  }

  return (
    <button
      style={getButtonStyle()}
      onClick={(event) => (props.disabled ? undefined : props.onClick)()}
      onMouseDown={(event) => handleMouseDown()}
      onMouseUp={(event) => handleMouseUp()}
      disabled={props.disabled}
    >
      {props.loading ? (
        <span>Loading...</span>
      ) : (
        <Fragment>{props.children || props.text}</Fragment>
      )}
    </button>
  );
}

export default Button;
