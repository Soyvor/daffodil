import {
  Directive,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[daffNotificationActions]',
  standalone: true,
})

export class DaffNotificationActionsDirective {

  /**
   * @docs-private
   */
  @HostBinding('class.daff-notification__actions') class = true;
}
