import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

@customElement("my-foo")
export default class Foo extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property() foo: any;
  @property() onClick: any;
  @property() className: any;

  @state() count = this.foo || 0;

  increment() {
    this.count++;
  }

  render() {
    return html`

          <div  class={props.className}  @click=${(event) => {
            this.increment();
            this.onClick?.();
          }}  .style=${{
      padding: "16px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      cursor: "pointer",
      backgroundColor: "#f9f9f9",
    }} ><h3 >Universal Foo Component</h3>
        <p >Initial value:
        ${this.foo}</p>
        <p >Current count:
        ${this.count}</p>
        <button  @click=${(event) => this.increment()} >
                Increment
              </button></div>
        `;
  }
}
