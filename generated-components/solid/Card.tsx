import { Show, createSignal, createMemo } from "solid-js";

function Card(props: any) {
  const [isHovered, setIsHovered] = createSignal(false);

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
    <>
      <div
        class={props.className}
        style={cardStyle}
        onMouseEnter={(event) => handleMouseEnter()}
        onMouseLeave={(event) => handleMouseLeave()}
        onClick={(event) => props.onClick()}
      >
        <Show when={props.image}>
          <img
            src={props.image}
            alt={props.title || "Card image"}
            style={imageStyle}
          />
        </Show>
        <Show when={props.title}>
          <h3 style={titleStyle}>{props.title}</h3>
        </Show>
        <Show when={props.subtitle}>
          <p style={subtitleStyle}>{props.subtitle}</p>
        </Show>
        <Show when={props.children}>
          <div>{props.children}</div>
        </Show>
      </div>
    </>
  );
}

export default Card;
