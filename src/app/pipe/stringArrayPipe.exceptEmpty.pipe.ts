import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'stringExceptEmpty'
})
export class StringArrayPipeExceptEmptyPipe implements PipeTransform {
  transform(array: string[]) {
    if (!array) {
      return array;
    }
    return array.filter(value => {
      return value !== '';
    });
  }
}
