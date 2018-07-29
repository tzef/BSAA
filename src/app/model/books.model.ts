export class Books {
  title: string;
  note: string;
  key: string;

  constructor(json, key = null) {
    this.title = json.title;
    this.note = json.note;
    this.key = key;
  }
}
