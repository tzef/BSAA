import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-paragraph-style-component',
  template: `
    <ng-container *ngFor="let text of content|stringNewLine">
      <ng-container *ngIf="text|linkModel; else isLinkElseBlock; let link">
        <p>{{ link[1] }}<a href="{{ link[2] }}" target="_blank">{{ link[3] }}</a>{{ link[4] }}</p>
      </ng-container>
      <ng-template #isLinkElseBlock>
        <ng-container *ngIf="text|colorModel; else isColorElseBlock; let color">
          <p>{{ color[1] }}<b style="color: red">{{ color[2] }}</b>{{ color[3] }}</p>
        </ng-container>
        <ng-template #isColorElseBlock>
          <ng-container *ngIf="text|boldModel; else isBoldElseBlock; let bold">
            <p>{{ bold[1] }}<b>{{ bold[2] }}</b>{{ bold[3] }}</p>
          </ng-container>
          <ng-template #isBoldElseBlock>
            <p>{{ text }}</p>
          </ng-template>
        </ng-template>
      </ng-template>
    </ng-container>
  `
})
export class ParagraphStyleComponent {
  @Input() content: string;
  constructor() {}
}
