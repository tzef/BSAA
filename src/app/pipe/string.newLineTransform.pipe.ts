import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'stringNewLine'
})
export class StringNewLineTransformPipe implements PipeTransform {
  transform(text: string) {
    if (!text) {
      return [];
    }
    return text.split('\n');
  }
}
