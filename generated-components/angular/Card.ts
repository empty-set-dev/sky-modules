import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Output, EventEmitter, Component, Input } from "@angular/core";

@Component({
  selector: "card",
  template: `
    <div
      [ngStyle]="cardStyle"
      (mouseenter)="handleMouseEnter()"
      (mouseleave)="handleMouseLeave()"
      (click)="this.onClick.emit()"
      [class]="className"
    >
      <ng-container *ngIf="image"
        ><img
          [attr.src]="image"
          [attr.alt]="title || 'Card image'"
          [ngStyle]="imageStyle"
      /></ng-container>
      <ng-container *ngIf="title"
        ><h3 [ngStyle]="titleStyle">{{title}}</h3></ng-container
      >
      <ng-container *ngIf="subtitle"
        ><p [ngStyle]="subtitleStyle">{{subtitle}}</p></ng-container
      >
      <ng-container *ngIf="children"
        ><div><ng-content></ng-content></div
      ></ng-container>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class Card {
  @Input() hoverable!: any;
  @Input() className!: any;
  @Input() image!: any;
  @Input() title!: any;
  @Input() subtitle!: any;
  @Output() onClick = new EventEmitter<any>();

  isHovered = false;
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
}

@NgModule({
  declarations: [Card],
  imports: [CommonModule],
  exports: [Card],
})
export class CardModule {}
