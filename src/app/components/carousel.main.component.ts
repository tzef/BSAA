import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-carousel-main-component',
  template: `
    <div *ngIf="imageList|stringExceptEmpty|arrayMoreThanZero">
      <ng-container [ngSwitch]="imageList|stringExceptEmpty|arrayMoreThanOne">
        <mdb-carousel *ngSwitchCase="true" style="z-index: 1" [isControls]="true" [animation]="'slide'">
          <ng-container *ngFor="let image of imageList|stringExceptEmpty">
            <mdb-slide>
              <img class="d-block w-100 carouselImage" src="{{ image }}">
            </mdb-slide>
          </ng-container>
        </mdb-carousel>
        <mdb-carousel *ngSwitchDefault style="z-index: 1" [isControls]="false">
          <ng-container *ngFor="let image of imageList|stringExceptEmpty">
            <mdb-slide>
              <img class="d-block w-100 carouselImage" src="{{ image }}">
            </mdb-slide>
          </ng-container>
        </mdb-carousel>
      </ng-container>
    </div>
    <div *ngIf="!(imageList|stringExceptEmpty|arrayMoreThanZero) && editMode" style="height: 120px"></div>
  `,
  styles: [`
    .carouselImage {
      height: 300px;
      object-fit: cover;
      margin-bottom: 50px;
    },
    @media (min-width: 576px) {
      .carouselImage {
        height: 400px;
        object-fit: cover;
        margin-bottom: 50px;
      },
    }
    @media (min-width: 768px) {
      .carouselImage {
        height: 500px;
        object-fit: cover;
        margin-bottom: 50px;
      },
    },
    @media (min-width: 992px) {
      .carouselImage {
        height: 600px;
        object-fit: cover;
        margin-bottom: 50px;
      },
    }
    @media (min-width: 1200px) {
      .carouselImage {
        height: 700px;
        object-fit: cover;
        margin-bottom: 50px;
      },
    }
  `]
})
export class CarouselMainComponent {
  @Input() imageList: string[];
  @Input() editMode = false;
  constructor() {}
}

