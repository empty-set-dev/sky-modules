import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

@Component({
  selector: "button",
  template: `
    <button
      [ngStyle]="getButtonStyle()"
      (click)="(disabled ? undefined : onClick)()"
      (mousedown)="handleMouseDown()"
      (mouseup)="handleMouseUp()"
      [attr.disabled]="disabled"
    >
      <ng-container *ngIf="loading"><span>Loading...</span></ng-container
      ><ng-container *ngIf="!(loading)">{{children || text}}</ng-container>
    </button>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export default class Button {
  @Input() disabled!: any;
  @Input() onClick!: any;
  @Input() loading!: any;
  @Input() text!: any;

  isPressed = false;
  handleMouseDown() {
    this.isPressed = true;
  }
  handleMouseUp() {
    this.isPressed = false;
  }
}

@NgModule({
  declarations: [Button],
  imports: [CommonModule],
  exports: [Button],
})
export class ButtonModule {}
