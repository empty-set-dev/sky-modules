"use client";
import * as React from "react";
import { useState } from "react";
import { View, Image, Text } from "@tarojs/components";

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
    <View
      style={cardStyle}
      onMouseEnter={(event) => handleMouseEnter()}
      onMouseLeave={(event) => handleMouseLeave()}
      onClick={(event) => props.onClick()}
    >
      {props.image ? (
        <Image
          source={{ uri: props.image }}
          alt={props.title || "Card image"}
          style={imageStyle}
        />
      ) : null}
      {props.title ? <View style={titleStyle}>{props.title}</View> : null}
      {props.subtitle ? (
        <View style={subtitleStyle}>{props.subtitle}</View>
      ) : null}
      {props.children ? <View>{props.children}</View> : null}
    </View>
  );
}

export default Card;
