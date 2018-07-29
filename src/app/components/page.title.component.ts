import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-page-title-component',
  template: `
    <ng-container [ngSwitch]="topImage">
      <div *ngSwitchCase=true><img style="margin-bottom: 30px" src="/assets/line_top.png"/></div>
      <div *ngSwitchDefault style="height: 30px"></div>
    </ng-container>
    <div style="margin-bottom: 30px"><strong class="title">{{ title }}</strong></div>
  `,
  styles: [
    `
      .title {
        font-size: 16px;
      }
    `
  ]
})
export class PageTitleComponent {
  @Input() title: string;
  @Input() topImage = true;
  constructor() {}
}
