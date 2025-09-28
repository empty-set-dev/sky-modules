"use client";
import * as React from "react";
import { useState } from "react";

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
        <>{props.children || props.text}</>
      )}
    </button>
  );
}

export default Button;
