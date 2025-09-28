import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

@customElement("my-card")
export default class Card extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() hoverable: any;
  @property() onClick: any;
  @property() className: any;
  @property() image: any;
  @property() title: any;
  @property() subtitle: any;
  @property() children: any;

  @state() isHovered = false;

  handleMouseEnter() {
    if (this.hoverable) {
      this.isHovered = true;
    }
  }
  handleMouseLeave() {
    if (this.hoverable) {
      this.isHovered = false;
    }
  }

  render() {
    return html`

          <div  class={props.className}  .style=${cardStyle}  @mouseenter=${(
      event
    ) => this.handleMouseEnter()}  @mouseleave=${(event) =>
      this.handleMouseLeave()}  @click=${(event) => this.onClick()} >${
      this.image
        ? html`<img  .src=${this.image}  .alt=${
            this.title || "Card image"
          }  .style=${imageStyle}  />`
        : null
    }
        ${
          this.title
            ? html`<h3  .style=${titleStyle} >${this.title}</h3>`
            : null
        }
        ${
          this.subtitle
            ? html`<p  .style=${subtitleStyle} >${this.subtitle}</p>`
            : null
        }
        ${this.children ? html`<div >${this.children}</div>` : null}</div>
        `;
  }
}
