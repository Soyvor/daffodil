import {
  Directive,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[daffProgressBarLabel]',
  standalone: true,
})
export class DaffProgressBarLabelDirective {
  /**
   * @docs-private
   */
  @HostBinding('class.daff-progress-bar__label') class = true;
}
