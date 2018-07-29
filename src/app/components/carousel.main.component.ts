import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-carousel-main-component',
  template: `
    <div *ngIf="imageList|stringExceptEmpty|arrayMoreThanZero">
      <ng-container [ngSwitch]="imageList|stringExceptEmpty|arrayMoreThanOne">
        <mdb-carousel *ngSwitchCase="true" style="z-index: 1" [isControls]="true" [animation]="'slide'">
          <ng-container *ngFor="let image of imageList|stringExceptEmpty">
            <mdb-slide>
              <img class="d-block w-100" style="height: 500px; object-fit: cover; margin-bottom: 50px" src="{{ image }}">
            </mdb-slide>
          </ng-container>
        </mdb-carousel>
        <mdb-carousel *ngSwitchDefault style="z-index: 1" [isControls]="false">
          <ng-container *ngFor="let image of imageList|stringExceptEmpty">
            <mdb-slide>
              <img class="d-block w-100" style="height: 500px; object-fit: cover; margin-bottom: 50px" src="{{ image }}">
            </mdb-slide>
          </ng-container>
        </mdb-carousel>
      </ng-container>
    </div>
    <div *ngIf="!(imageList|stringExceptEmpty|arrayMoreThanZero) && editMode" style="height: 120px"></div>
  `
})
export class CarouselMainComponent {
  @Input() imageList: string[];
  @Input() editMode = false;
  constructor() {}
}

