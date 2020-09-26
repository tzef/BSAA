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
          <img src="/assets/fb_w.png">
        </a>
        <a class="btn-floating waves-light" mdbWavesEffect
           href="https://www.instagram.com/brightstar_arts/" target="_blank">
          <img src="/assets/ig_w.png">
        </a>
        <a class="btn-floating waves-light" mdbWavesEffect
           href="https://www.youtube.com/channel/UCWj4Cm0BDiicehhRZyoQvHg" target="_blank">
          <img src="/assets/youtube_w.png">
        </a>
      </div>
      <!--/.Social buttons-->

      <div class="text-center">
        <span style="font-size: 12px">11148 臺北市士林區忠誠路一段 62 號 3 樓 </span><br>
        <i class="fa fa-phone"> </i><span style="font-size: 12px"> 886-2-2833-2255 #131 </span>
        <i class="fa fa-envelope"> </i><span style="font-size: 12px"> info@bsaa.org </span>
      </div>

      <!--Copyright-->
      <div class="theme-orange text-center py-3">
        <div class="container-fluid">
          © 2018 Copyright： BSAA. All rights reserved.
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
