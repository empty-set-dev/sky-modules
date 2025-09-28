import {
  Component,
  h,
  Fragment,
  Event,
  EventEmitter,
  Prop,
  State,
} from "@stencil/core";

@Component({
  tag: "foo",
})
export class Foo {
  @Prop() foo: any;
  @Event() click: any;
  @Prop() className: any;
  @State() count = this.foo || 0;

  increment() {
    this.count++;
  }

  componentDidLoad() {}

  render() {
    return (
      <div
        class={this.className}
        onClick={() => {
          this.increment();
          this.click?.();
        }}
        style={{
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          cursor: "pointer",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>Universal Foo Component</h3>
        <p>
          Initial value:
          {this.foo}
        </p>
        <p>
          Current count:
          {this.count}
        </p>
        <button onClick={() => this.increment()}>Increment</button>
      </div>
    );
  }
}
