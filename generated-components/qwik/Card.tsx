import { $, Fragment, Slot, component$, h, useStore } from "@builder.io/qwik";

export const handleMouseEnter = function handleMouseEnter(props, state) {
  if (props.hoverable) {
    state.isHovered = true;
  }
};
export const handleMouseLeave = function handleMouseLeave(props, state) {
  if (props.hoverable) {
    state.isHovered = false;
  }
};
export const Card = component$((props: any) => {
  const state = useStore<any>({ isHovered: false });

  return (
    <div
      style={cardStyle}
      onMouseEnter$={$((event) => handleMouseEnter(props, state))}
      onMouseLeave$={$((event) => handleMouseLeave(props, state))}
      onClick$={$((event) => props.onClick())}
      class={props.className}
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
      {props.children ? (
        <div>
          <Slot></Slot>
        </div>
      ) : null}
    </div>
  );
});

export default Card;
