import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'arrayLength'
})
export class ArrayLengthPipe implements PipeTransform {
  transform(array: string[]) {
    if (!array) {
      return 0;
    }
    return array.length;
  }
}
