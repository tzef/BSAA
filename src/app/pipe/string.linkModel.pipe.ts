import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'linkModel'
})
export class StringLinkModelPipe implements PipeTransform {
  transform(text: string) {
    if (!text) {
      return null;
    }
    const regex = /<a\s+(?:[^>]*?\s+)?href=(?:["'])(.*)['"]>(.*)<\/a>/g;
    const results = regex.exec(text);
    return results;
  }
}
