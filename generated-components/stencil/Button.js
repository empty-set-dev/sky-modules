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
  tag: "button",
})
export class Button {
  @Prop() disabled: any;
  @Event() click: any;
  @Prop() loading: any;
  @Prop() text: any;
  @State() isPressed = false;

  handleMouseDown() {
    this.isPressed = true;
  }
  handleMouseUp() {
    this.isPressed = false;
  }

  componentDidLoad() {}

  render() {
    return (
      <button
        style={getButtonStyle()}
        onClick={() => (this.disabled ? undefined : this.click)()}
        onMouseDown={() => this.handleMouseDown()}
        onMouseUp={() => this.handleMouseUp()}
        disabled={this.disabled}
      >
        {this.loading ? <span>Loading...</span> : this.children || this.text}
      </button>
    );
  }
}
