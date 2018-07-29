import {Component} from '@angular/core';

@Component({
  selector: 'app-separate-left-component',
  template: `
    <div class="row justify-content-start no-gutters">
      <div class="col-3">
        <img style="width: 100%; height: 3px" src="/assets/line.png"/>
      </div>
      <div class="col-1">
        <img src="/assets/line_dot.png"/>
      </div>
    </div>
  `
})
export class SeparateLeftComponent {
  constructor() {}
}
