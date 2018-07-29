import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-carousel-video-component',
  template: `
    <div *ngIf="videoList|stringExceptEmpty|arrayMoreThanZero">
      <ng-container [ngSwitch]="videoList|stringExceptEmpty|arrayMoreThanOne">
        <mdb-carousel *ngSwitchCase="true" style="z-index: 1" [isControls]="true" [animation]="'slide'">
          <ng-container *ngFor="let url of videoList|stringExceptEmpty">
            <mdb-slide style="height: 500px; object-fit: cover; margin-bottom: 50px">
              <video class="video-fluid" autoplay loop>
                <source src="{{ url }}" type="video/mp4" />
              </video>
            </mdb-slide>
          </ng-container>
        </mdb-carousel>
        <mdb-carousel *ngSwitchDefault style="z-index: 1" [isControls]="false">
          <ng-container *ngFor="let url of videoList|stringExceptEmpty">
            <mdb-slide style="height: 500px; object-fit: cover; margin-bottom: 50px">
              <video class="video-fluid" autoplay loop>
                <source src="{{ url }}" type="video/mp4" />
              </video>
            </mdb-slide>
          </ng-container>
        </mdb-carousel>
      </ng-container>
    </div>
    <div *ngIf="!(videoList|stringExceptEmpty|arrayMoreThanZero) && editMode" style="height: 120px"></div>
  `
})
export class CarouselVideoComponent {
  @Input() videoList: string[];
  @Input() editMode = false;
  constructor() {}
}

