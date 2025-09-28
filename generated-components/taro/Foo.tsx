"use client";
import * as React from "react";
import { useState } from "react";
import { View, Text, Button } from "@tarojs/components";

function Foo(props: any) {
  const [count, setCount] = useState(() => props.foo || 0);

  function increment() {
    count++;
  }

  return (
    <View
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
    >
      <View>Universal Foo Component</View>
      <View>Initial value: {props.foo}</View>
      <View>Current count: {count}</View>
      <Button onClick={(event) => increment()}>Increment</Button>
    </View>
  );
}

export default Foo;
