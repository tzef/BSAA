export class ImageModel {
  sort: number;
  url: string;
  key: string;
  zh_note: string;
  en_note: string;

  constructor(sort, zh_note, en_note, url, key) {
    this.sort = sort;
    this.zh_note = zh_note;
    this.en_note = en_note;
    this.url = url;
    this.key = key;
  }
}
