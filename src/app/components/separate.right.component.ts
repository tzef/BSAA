import {Component} from '@angular/core';

@Component({
  selector: 'app-separate-right-component',
  template: `
    <div class="row justify-content-end no-gutters">
      <div class="col-1" style="text-align: right">
        <img src="/assets/line_dot.png"/>
      </div>
      <div class="col-3">
        <img style="width: 100%; height: 3px" src="/assets/line.png"/>
      </div>
    </div>
    <br>
  `
})
export class SeparateRightComponent {
  constructor() {}
}
