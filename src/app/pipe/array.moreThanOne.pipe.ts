import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'arrayMoreThanOne'
})
export class ArrayMoreThanOnePipe implements PipeTransform {
  transform(array: string[]) {
    if (!array) {
      return false;
    }
    return array.length > 1;
  }
}
