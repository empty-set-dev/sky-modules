"use client";
import * as React from "react";
import { useState } from "react";

export interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children?: any;
}

function Button(props: ButtonProps) {
  const [isPressed, setIsPressed] = useState(() => false);

  function handleMouseDown() {
    setIsPressed(true);
  }

  function handleMouseUp() {
    setIsPressed(false);
  }

  return (
    <button
      onClick={(event) =>
        (props.disabled ? undefined : props.onClick ?? undefined)()
      }
      onMouseDown={(event) => handleMouseDown()}
      onMouseUp={(event) => handleMouseUp()}
      disabled={props.disabled}
    >
      {props.loading ? (
        <span>Loading...</span>
      ) : (
        <>{props.children || props.text}</>
      )}
      123
    </button>
  );
}

export default Button;
