import {ImageModel} from './image.model';

export class GalleryModel {
  key: string;
  date: string;
  imgUrl: string;
  title_zh: string;
  title_en: string;
  content_zh: string;
  content_en: string;
  subTitle_zh: string;
  subTitle_en: string;
  imgList: ImageModel[] = [];

  constructor(json, key = null) {
    this.key = key;
    this.date = json.date ? json.date : '';
    this.imgUrl = json.imgUrl ? json.imgUrl : '';
    this.title_zh = json.title_zh ? json.title_zh : '';
    this.title_en = json.title_en ? json.title_en : '';
    this.content_zh = json.content_zh ? json.content_zh : '';
    this.content_en = json.content_en ? json.content_en : '';
    this.subTitle_zh = json.subTitle_zh ? json.subTitle_zh : '';
    this.subTitle_en = json.subTitle_en ? json.subTitle_en : '';
  }

  getTitle(languaeCode: string) {
    if (languaeCode === 'zh') {
      return this.title_zh;
    }
    if (languaeCode === 'en') {
      return this.title_en;
    }
  }
  getSubTitle(languaeCode: string) {
    if (languaeCode === 'zh') {
      return this.subTitle_zh;
    }
    if (languaeCode === 'en') {
      return this.subTitle_en;
    }
  }
  getContent(languaeCode: string) {
    if (languaeCode === 'zh') {
      return this.content_zh;
    }
    if (languaeCode === 'en') {
      return this.content_en;
    }
  }
}
