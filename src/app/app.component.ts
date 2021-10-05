import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {distinctUntilChanged} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';

declare let gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private titleService: Title) {
    this.titleService.setTitle('社團法人台灣炫光藝術協會');
    this.router.events
      .pipe(distinctUntilChanged((previous: any, current: any) => {
        if (current instanceof NavigationEnd) {
          return previous.url === current.url;
        }
        return true;
      }))
      .subscribe(
        (x: any) => { gtag('event', 'page_view', { 'page_path': x.url }); });
  }

  ngOnInit() {}
}
