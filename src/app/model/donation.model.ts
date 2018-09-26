export class DonationModel {
  description: string;
  plan: string;
  photo1title: string;
  photo2title: string;

  constructor(json) {
    this.description = json.description ? json.description : '';
    this.plan = json.plan ? json.plan : '';
    this.photo1title = json.photo1title ? json.photo1title : '';
    this.photo2title = json.photo2title ? json.photo2title : '';
  }
}
