import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {AppComponent} from './app.component';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {routes} from './routes';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationModule} from './navigation/navigation.module';
import {PageModule} from './page/page.module';
import {MDBBootstrapModulesPro, MDBSpinningPreloader, ToastModule} from 'ng-uikit-pro-standard';
import {ModalGalleryModule} from 'angular-modal-gallery';
import {AdministratorModule} from './administrator/administrator.module';
import 'hammerjs';
import 'mousetrap';

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
