import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'arrayMoreThanZero'
})
export class ArrayMoreThanZeroPipe implements PipeTransform {
  transform(array: string[]) {
    if (!array) {
      return false;
    }
    return array.length > 0;
  }
}
