import {ImageModel} from './image.model';
import {VideoModel} from './video.model';

export class ArtistModel {
  key: string;
  zh_name: string;
  en_name: string;
  zh_note: string;
  en_note: string;
  zh_description: string;
  en_description: string;
  imgUrl: string;
  videoList: VideoModel[] = [];
  imgList: ImageModel[] = [];

  constructor(json, key = null) {
    this.key = key;
    this.zh_name = json.zh_name ? json.zh_name : '';
    this.en_name = json.en_name ? json.en_name : '';
    this.zh_note = json.zh_note ? json.zh_note : '';
    this.en_note = json.en_note ? json.en_note : '';
    this.zh_description = json.zh_description ? json.zh_description : '';
    this.en_description = json.en_description ? json.en_description : '';
    this.imgUrl = json.imgUrl ? json.imgUrl : '';
    let videoIndex = 0;
    const videoList: Array<string> = json['videoList'];
    for (const videoListKey in videoList) {
      this.videoList.push(new VideoModel(videoIndex, videoList[videoListKey], videoListKey));
      videoIndex += 1;
    }
    let imgIndex = 0;
    const imgList: Array<string> = json['imgList'];
    for (const imgListKey in imgList) {
      this.imgList.push(new ImageModel(imgIndex, imgList[imgListKey]['zh_note'], imgList[imgListKey]['en_note'], imgList[imgListKey]['url'], imgListKey));
      imgIndex += 1;
    }
  }
}
