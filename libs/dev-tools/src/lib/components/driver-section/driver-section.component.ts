import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';

import { DaffDriverConfig } from '../../interfaces/driver-config.interface';

@Component({
  selector: 'daff-driver-section',
  standalone: true,
  templateUrl: './driver-section.component.html',
  styleUrls: ['./driver-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaffDriverSectionComponent implements OnInit {
  @Input({ required: true }) driver!: DaffDriverConfig;

  @Output() applyChanges = new EventEmitter<{ driverName: string; newDriver: string }>();
  @Output() resetToDefault = new EventEmitter<string>();
  @Output() testConnection = new EventEmitter<string>();

  selectedDriver = '';

  ngOnInit() {
    this.selectedDriver = this.driver.currentDriver;
  }

  onDriverChange(event: Event) {
    const target = <HTMLSelectElement>event.target;
    this.selectedDriver = target.value;
  }

  onApplyChanges() {
    this.applyChanges.emit({
      driverName: this.driver.name,
      newDriver: this.selectedDriver,
    });
  }

  onResetToDefault() {
    this.resetToDefault.emit(this.driver.name);
  }

  onTestConnection() {
    this.testConnection.emit(this.driver.name);
  }
}
