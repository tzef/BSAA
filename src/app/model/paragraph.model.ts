export class ParagraphModel {
  content: string;
  img: string;
  key: string;

  constructor(json, key = null) {
    this.content = json.content ? json.content : '';
    this.img = json.img ? json.img : '';
    this.key = key;
  }
}
