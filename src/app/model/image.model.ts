export class ImageModel {
  sort: number;
  url: string;
  key: string;
  note: string;

  constructor(sort, note, url, key) {
    this.sort = sort;
    this.note = note
    this.url = url;
    this.key = key;
  }
}
