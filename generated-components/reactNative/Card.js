import * as React from "react";
import { View, StyleSheet, Image, Text, Pressable } from "react-native";
import { useState } from "react";

function Card(props: any) {
  const [isHovered, setIsHovered] = useState(() => false);

  function handleMouseEnter() {
    if (props.hoverable) {
      setIsHovered(true);
    }
  }

  function handleMouseLeave() {
    if (props.hoverable) {
      setIsHovered(false);
    }
  }

  return (
    <Pressable
      style={cardStyle}
      onMouseEnter={(event) => handleMouseEnter()}
      onMouseLeave={(event) => handleMouseLeave()}
      onPress={(event) => props.onClick()}
    >
      {props.image ? (
        <Image
          source={{ uri: props.image }}
          alt={props.title || "Card image"}
          style={imageStyle}
        />
      ) : null}
      {props.title ? (
        <View style={titleStyle}>
          <Text>{props.title}</Text>
        </View>
      ) : null}
      {props.subtitle ? (
        <View style={subtitleStyle}>
          <Text>{props.subtitle}</Text>
        </View>
      ) : null}
      {props.children ? <View>{props.children}</View> : null}
    </Pressable>
  );
}

export default Card;
