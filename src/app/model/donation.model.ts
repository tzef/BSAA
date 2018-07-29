export class DonationModel {
  description: string;
  lat: number;
  lng: number;
  zoomValue: number;
  key: string;

  constructor(json, key = null) {
    this.description = json.description ? json.description : '';
    this.lat = json.latitude ? json.latitude : '';
    this.lng = json.longitude ? json.longitude : '';
    this.zoomValue = json.zoomValue ? json.zoomValue : '';
    this.key = key;
  }
}
