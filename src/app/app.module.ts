import 'hammerjs';
import 'mousetrap';
import {routes} from './routes';
import {AppComponent} from './app.component';
import {PageModule} from './page/page.module';
import {BrowserModule} from '@angular/platform-browser';
import {ModalGalleryModule} from 'angular-modal-gallery';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NavigationModule} from './navigation/navigation.module';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {AdministratorModule} from './administrator/administrator.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MDBBootstrapModulesPro, MDBSpinningPreloader, ToastModule} from 'ng-uikit-pro-standard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ToastModule.forRoot(),
    ModalGalleryModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    BrowserModule, BrowserAnimationsModule,
    NavigationModule, PageModule, AdministratorModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [MDBSpinningPreloader],
  bootstrap: [AppComponent]
})
export class AppModule {}
