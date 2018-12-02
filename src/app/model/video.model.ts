import {SafeUrl} from '@angular/platform-browser';

export class VideoModel {
  safeUrl: SafeUrl;
  sort: number;
  url: string;
  key: string;

  constructor(sort, url, key) {
    this.sort = sort;
    this.url = url;
    this.key = key;
  }
}
