import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'boldModel'
})
export class StringBoldModelPipe implements PipeTransform {
  transform(text: string) {
    if (!text) {
      return null;
    }
    const regex = /(.*)<bold>(.*)<\/bold>(.*)/g;
    const results = regex.exec(text);
    return results;
  }
}
