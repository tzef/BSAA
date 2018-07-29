import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NavigationMenuComponent} from './navigation.menu.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationHeaderComponent} from './navigation.header.component';
import {NavigationFooterComponent} from './navigation.footer.component';
import {RouterModule} from '@angular/router';
import {MDBBootstrapModulesPro} from 'ng-uikit-pro-standard';
import {CarouselMainComponent} from '../components/carousel.main.component';
import {StringArrayPipeExceptEmptyPipe} from '../pipe/stringArrayPipe.exceptEmpty.pipe';
import {ArrayMoreThanOnePipe} from '../pipe/array.moreThanOne.pipe';
import {ArrayLengthPipe} from '../pipe/array.length.pipe';
import {ArrayMoreThanZeroPipe} from '../pipe/array.moreThanZero.pipe';
import {CarouselVideoComponent} from '../components/carousel.video.component';

@NgModule({
  imports: [
    BrowserModule, BrowserAnimationsModule, RouterModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
  declarations: [
    StringArrayPipeExceptEmptyPipe, ArrayMoreThanZeroPipe, ArrayMoreThanOnePipe, ArrayLengthPipe,
    NavigationHeaderComponent, NavigationMenuComponent, NavigationFooterComponent,
    CarouselMainComponent, CarouselVideoComponent
  ],
  providers: [],
  exports: [
    NavigationHeaderComponent, NavigationMenuComponent, NavigationFooterComponent,
    CarouselMainComponent, CarouselVideoComponent
  ]
})
export class NavigationModule {
}
