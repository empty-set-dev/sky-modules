"use client";
import * as React from "react";
import { useState } from "react";
import { Button, View, Text } from "@tarojs/components";

function Button(props: any) {
  const [isPressed, setIsPressed] = useState(() => false);

  function handleMouseDown() {
    setIsPressed(true);
  }

  function handleMouseUp() {
    setIsPressed(false);
  }

  return (
    <Button
      style={getButtonStyle()}
      onClick={(event) => (props.disabled ? undefined : props.onClick)()}
      onMouseDown={(event) => handleMouseDown()}
      onMouseUp={(event) => handleMouseUp()}
      disabled={props.disabled}
    >
      {props.loading ? (
        <Text>Loading...</Text>
      ) : (
        <>{props.children || props.text}</>
      )}
    </Button>
  );
}

export default Button;
