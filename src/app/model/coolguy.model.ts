export class CoolguyModel {
  name: string;
  note: string;
  imgUrl: string;
  description: string;
  key: string;

  constructor(json, key = null) {
    this.name = json.name ? json.name : '';
    this.note = json.note ? json.note : '';
    this.imgUrl = json.imgUrl ? json.imgUrl : '';
    this.description = json.description ? json.description : '';
    this.key = key;
  }
}
