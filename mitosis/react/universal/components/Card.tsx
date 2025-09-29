"use client";
import * as React from "react";
import { useState } from "react";
import tw from "twrnc";

export interface CardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  children?: any;
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
}

function Card(props: CardProps) {
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
    <div
      style={cardStyle}
      onMouseEnter={(event) => handleMouseEnter()}
      onMouseLeave={(event) => handleMouseLeave()}
      onClick={(event) => props.onClick()}
      className={props.className}
    >
      {props.image ? (
        <img
          src={props.image}
          alt={props.title || "Card image"}
          style={imageStyle}
        />
      ) : null}
      {props.title ? <h3 style={titleStyle}>{props.title}</h3> : null}
      {props.subtitle ? <p style={subtitleStyle}>{props.subtitle}</p> : null}
      {props.children ? <div>{props.children}</div> : null}
    </div>
  );
}

export default Card;
