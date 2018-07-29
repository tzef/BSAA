import {ParagraphModel} from './paragraph.model';

export class UpcomingModel {
  key: string;
  title: string;
  imgUrl: string;
  content: string;
  subTitle: string;
  paragraphList: ParagraphModel[] = [];

  constructor(json, key = null) {
    this.key = key;
    this.title = json.title ? json.title : '';
    this.imgUrl = json.imgUrl ? json.imgUrl : '';
    this.content = json.content ? json.content : '';
    this.subTitle = json.subTitle ? json.subTitle : '';
  }
}
