import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Component, Input } from "@angular/core";

@Component({
  selector: "foo",
  template: `
    <div
      (click)="
          increment();
          onClick?.();
        "
      [ngStyle]="{
          padding: '16px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: '#f9f9f9'
        }"
      [class]="className"
    >
      <h3>Universal Foo Component</h3>
      <p>Initial value: {{foo}}</p>
      <p>Current count: {{count}}</p>
      <button (click)="increment()">Increment</button>
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
export default class Foo {
  @Input() foo!: any;
  @Input() onClick!: any;
  @Input() className!: any;

  count = null;
  increment() {
    this.count++;
  }

  ngOnInit() {
    this.count = this.foo || 0;
  }
}

@NgModule({
  declarations: [Foo],
  imports: [CommonModule],
  exports: [Foo],
})
export class FooModule {}
