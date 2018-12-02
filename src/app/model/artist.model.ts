import {ImageModel} from './image.model';
import {VideoModel} from './video.model';

export class ArtistModel {
  key: string;
  name: string;
  note: string;
  imgUrl: string;
  description: string;
  videoList: VideoModel[] = [];
  imgList: ImageModel[] = [];

  constructor(json, key = null) {
    this.key = key;
    this.name = json.name ? json.name : '';
    this.note = json.note ? json.note : '';
    this.imgUrl = json.imgUrl ? json.imgUrl : '';
    this.description = json.description ? json.description : '';
    let videoIndex = 0;
    const videoList: Array<string> = json['videoList'];
    for (const videoListKey in videoList) {
      this.videoList.push(new VideoModel(videoIndex, videoList[videoListKey], videoListKey));
      videoIndex += 1;
    }
    let imgIndex = 0;
    const imgList: Array<string> = json['imgList'];
    for (const imgListKey in imgList) {
      this.imgList.push(new ImageModel(imgIndex, imgList[imgListKey]['note'], imgList[imgListKey]['url'], imgListKey));
      imgIndex += 1;
    }
  }
}
