import {
  Directive,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[daffNotificationTitle]',
  standalone: true,
})

export class DaffNotificationTitleDirective {

  /**
   * @docs-private
   */
  @HostBinding('class.daff-notification__title') class = true;
}
