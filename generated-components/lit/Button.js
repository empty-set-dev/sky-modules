import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

@customElement("my-button")
export default class Button extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() disabled: any;
  @property() onClick: any;
  @property() loading: any;
  @property() children: any;
  @property() text: any;

  @state() isPressed = false;

  handleMouseDown() {
    this.isPressed = true;
  }
  handleMouseUp() {
    this.isPressed = false;
  }

  render() {
    return html`

          <button  .style=${getButtonStyle()}  @click=${(event) =>
      (this.disabled ? undefined : this.onClick)()}  @mousedown=${(event) =>
      this.handleMouseDown()}  @mouseup=${(event) =>
      this.handleMouseUp()}  .disabled=${this.disabled} >${
      this.loading
        ? html`<span >Loading...</span>`
        : html`${this.children || this.text}`
    }</button>
        `;
  }
}
