import {ParagraphModel} from './paragraph.model';

export class FormPlanModel {
  key: string;
  createdAt: string;
  avatarUrl: string;
  age: string;
  address: string;
  cellPhone: string;
  createConcept: string;
  dream: string;
  email: string;
  fileUrl: string;
  homePhone: string;
  introduce: string;
  name: string;
  productMaterial: string;
  productName: string;
  productSize: string;
  school: string;
  videoUrl: string;

  constructor(json, key = null) {
    this.key = key;
    this.createdAt = json.createdAt ? json.createdAt : '';
    this.avatarUrl = json.avatarUrl ? json.avatarUrl : '';
    this.age = json.age ? json.age : '';
    this.address = json.address ? json.address : '';
    this.cellPhone = json.cellPhone ? json.cellPhone : '';
    this.createConcept = json.createConcept ? json.createConcept : '';
    this.dream = json.dream ? json.dream : '';
    this.email = json.email ? json.email : '';
    this.fileUrl = json.fileUrl ? json.fileUrl : '';
    this.homePhone = json.homePhone ? json.homePhone : '';
    this.introduce = json.introduce ? json.introduce : '';
    this.name = json.name ? json.name : '';
    this.productMaterial = json.productMaterial ? json.productMaterial : '';
    this.productName = json.productName ? json.productName : '';
    this.productSize = json.productSize ? json.productSize : '';
    this.school = json.school ? json.school : '';
    this.videoUrl = json.videoUrl ? json.videoUrl : '';
  }
}
