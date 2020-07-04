import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'colorModel'
})
export class StringColorModelPipe implements PipeTransform {
  transform(text: string) {
    if (!text) {
      return null;
    }
    const regex = /(.*)<red>(.*)<\/red>(.*)/g;
    const results = regex.exec(text);
    return results;
  }
}
