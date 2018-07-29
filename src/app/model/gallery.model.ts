import {ImageModel} from './image.model';

export class GalleryModel {
  key: string;
  date: string;
  title: string;
  imgUrl: string;
  content: string;
  subTitle: string;
  imgList: ImageModel[] = [];

  constructor(json, key = null) {
    this.key = key;
    this.date = json.date ? json.date : '';
    this.title = json.title ? json.title : '';
    this.imgUrl = json.imgUrl ? json.imgUrl : '';
    this.content = json.content ? json.content : '';
    this.subTitle = json.subTitle ? json.subTitle : '';
  }
}
