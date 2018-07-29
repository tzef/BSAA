import {ImageModel} from './image.model';

export class ArtistModel {
  key: string;
  name: string;
  note: string;
  imgUrl: string;
  iframe: string;
  description: string;
  imgList: ImageModel[] = [];

  constructor(json, key = null) {
    this.key = key;
    this.name = json.name ? json.name : '';
    this.note = json.note ? json.note : '';
    this.imgUrl = json.imgUrl ? json.imgUrl : '';
    this.iframe = json.iframe ? json.iframe : '';
    this.description = json.description ? json.description : '';
  }
}
