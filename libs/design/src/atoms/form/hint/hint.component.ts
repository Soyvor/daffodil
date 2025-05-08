import {
  Component,
  ChangeDetectionStrategy,
  HostBinding,
} from '@angular/core';

@Component({
  selector: 'daff-hint',
  template: '<ng-content></ng-content>',
  styleUrls: ['./hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DaffHintComponent {
  /**
   * @docs-private
   */
  @HostBinding('class.daff-hint') class = true;
}
