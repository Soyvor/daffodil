import {
  Directive,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[daffNotificationMessage]',
  standalone: true,
})

export class DaffNotificationMessageDirective {

  /**
   * @docs-private
   */
  @HostBinding('class.daff-notification__message') class = true;
}
