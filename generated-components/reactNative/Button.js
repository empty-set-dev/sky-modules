import * as React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
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
    <Button
      style={getButtonStyle()}
      onPress={(event) => (props.disabled ? undefined : props.onClick)()}
      onMouseDown={(event) => handleMouseDown()}
      onMouseUp={(event) => handleMouseUp()}
      disabled={props.disabled}
    >
      {props.loading ? (
        <View>
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          <Text>{props.children || props.text}</Text>
        </>
      )}
    </Button>
  );
}

export default Button;
