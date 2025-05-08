import {
  Directive,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[daffNotificationSubtitle]',
  standalone: true,
})

export class DaffNotificationSubtitleDirective {

  /**
   * @docs-private
   */
  @HostBinding('class.daff-notification__subtitle') class = true;
}
