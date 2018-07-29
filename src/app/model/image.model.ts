export class ImageModel {
  sort: number;
  url: string;
  key: string;

  constructor(sort, url, key) {
    this.sort = sort;
    this.url = url;
    this.key = key;
  }
}
