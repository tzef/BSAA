import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'intIsOdd'
})
export class IntIsOddPipe implements PipeTransform {
  transform(value: number) {
    return !(value % 2 === 0);
  }
}
