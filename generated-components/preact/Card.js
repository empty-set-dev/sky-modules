/** @jsx h */
import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

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
