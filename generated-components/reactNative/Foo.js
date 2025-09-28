import * as React from "react";
import { View, StyleSheet, Text, Pressable, Button } from "react-native";
import { useState } from "react";

function Foo(props: any) {
  const [count, setCount] = useState(() => props.foo || 0);

  function increment() {
    count++;
  }

  return (
    <Pressable
      onPress={(event) => {
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
    >
      <View>
        <Text>Universal Foo Component</Text>
      </View>
      <View>
        <Text>Initial value: </Text>
        <Text>{props.foo}</Text>
      </View>
      <View>
        <Text>Current count: </Text>
        <Text>{count}</Text>
      </View>
      <Button onPress={(event) => increment()}>
        <Text>Increment</Text>
      </Button>
    </Pressable>
  );
}

export default Foo;
