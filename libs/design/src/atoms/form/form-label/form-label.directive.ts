import {
  Directive,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[daffFormLabel]',
  standalone: false,
})
export class DaffFormLabelDirective {
  /**
   * @docs-private
   */
  @HostBinding('class.daff-form-label') class = true;
}
