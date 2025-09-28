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
  tag: "card",
})
export class Card {
  @Prop() hoverable: any;
  @Event() click: any;
  @Prop() className: any;
  @Prop() image: any;
  @Prop() title: any;
  @Prop() subtitle: any;
  @State() isHovered = false;

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

  componentDidLoad() {}

  render() {
    return (
      <div
        class={this.className}
        style={cardStyle}
        onMouseEnter={() => this.handleMouseEnter()}
        onMouseLeave={() => this.handleMouseLeave()}
        onClick={() => this.click.emit()}
      >
        {this.image ? (
          <img
            src={this.image}
            alt={this.title || "Card image"}
            style={imageStyle}
          />
        ) : null}
        {this.title ? <h3 style={titleStyle}>{this.title}</h3> : null}
        {this.subtitle ? <p style={subtitleStyle}>{this.subtitle}</p> : null}
        {this.children ? (
          <div>
            <slot></slot>
          </div>
        ) : null}
      </div>
    );
  }
}
