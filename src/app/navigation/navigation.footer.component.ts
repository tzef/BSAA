import {Component} from '@angular/core';

@Component({
  selector: 'app-footer-component',
  template: `
    <!--Footer-->
    <footer class="page-footer theme-orange text-center text-md-left pt-4 mt-4">
      <!--Social buttons-->
      <div class="text-center mb-3">
        <a class="btn-floating waves-light" mdbWavesEffect
           href="https://www.facebook.com/%E5%8F%B0%E7%81%A3%E7%82%AB%E5%85%89%E8%97%9D%E8%A1%93%E5%8D%94%E6%9C%83-338836259459978/"
           target="_blank">
          <img src="/assets/fb.png">
        </a>
        <a class="btn-floating waves-light" mdbWavesEffect
           href="https://www.instagram.com/brightstar_arts/" target="_blank">
          <img src="/assets/ig.png">
        </a>
        <a class="btn-floating waves-light" mdbWavesEffect
           href="https://www.youtube.com/channel/UCDL8tQEfCHPFCYSipXw7GhA" target="_blank">
          <img src="/assets/youtube.png">
        </a>
      </div>
      <!--/.Social buttons-->

      <div class="text-center">
        <i class="fa fa-phone" style="color: black"> </i><span style="font-size: 12px; color: black"> 0989-876-225 </span>
        <i class="fa fa-envelope" style="color: black"> </i><span style="font-size: 12px; color: black"> info@bsaa.org </span>
      </div>

      <!--Copyright-->
      <div class="theme-orange text-center py-3">
        <div class="container-fluid" style="color: black">
          © 2022 Copyright： BSAA. All rights reserved.
        </div>
      </div>
      <!--/.Copyright-->

    </footer>
    <!--/.Footer-->
  `
})
export class NavigationFooterComponent {
  constructor() {}
}
