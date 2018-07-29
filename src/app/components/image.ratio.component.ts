import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-image-ratio-component',
  template: `
    <div style="border-style: solid; border-color: black; border-width: 1px" [ngClass] = "{
      'ratio_container_1_1': ratio == '1:1',
      'ratio_container_3_1': ratio == '3:1',
      'ratio_container_4_3': ratio == '4:3',
      'ratio_container_16_9': ratio == '16:9'
    }">
      <img class="image border-dark" src="{{ image }}" alt="{{ alt }}"/>
    </div>
  `,
  styles: [
    `
      .ratio_container_3_1 {
        width: 100%;
        height: 0;
        padding-bottom: 33.33%;
        position: relative;
      }
      .ratio_container_16_9 {
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;
        position: relative;
      }
      .ratio_container_4_3 {
        width: 100%;
        height: 0;
        padding-bottom: 75%;
        position: relative;
      }
      .ratio_container_1_1 {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        position: relative;
      }
      .image {
        width: 100%;
        height: 100%;
        position: absolute;
        object-fit: cover;
      }
    `
  ]
})
export class ImageRatioComponent {
  @Input() image: string;
  @Input() ratio: string;
  @Input() alt: string;
  constructor() {}
}
