import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  DaffDevToolsDriver,
  DaffDevToolsDriverProperty,
} from '../../interfaces/driver';
import { DaffDriverConfig } from '../../interfaces/driver-config.interface';
import { DaffDevToolsSelectedDriver } from '../../interfaces/selected-driver';

@Component({
  selector: 'daff-driver-section',
  standalone: true,
  templateUrl: './driver-section.component.html',
  styleUrls: ['./driver-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaffDriverSectionComponent implements OnInit {
  @Input({ required: true }) driver!: DaffDriverConfig;

  @Output() applyChanges = new EventEmitter<{ driverName: string; newDriver: DaffDevToolsSelectedDriver }>();
  @Output() resetToDefault = new EventEmitter<string>();
  @Output() testConnection = new EventEmitter<string>();

  selectedDriver: DaffDevToolsDriver | null = null;
  propertyValues: Record<string, any> = {};

  ngOnInit() {
    const currentDriverId = this.driver.currentDriver.id;
    this.selectedDriver = this.driver.availableDrivers.find(d => d.id === currentDriverId) || null;
    this.initializePropertyValues();
  }

  private initializePropertyValues() {
    this.propertyValues = { ...this.driver.currentDriver.properties };
  }

  onDriverChange(event: Event) {
    const target = <HTMLSelectElement>event.target;
    this.selectedDriver = this.driver.availableDrivers.find(d => d.id === target.value) || null;
    this.updatePropertyValues();
  }

  private updatePropertyValues() {
    this.propertyValues = {};
    if (this.selectedDriver?.properties) {
      this.selectedDriver.properties.forEach((property, key) => {
        this.propertyValues[key] = property.defaultValue || '';
      });
    }
  }

  onPropertyChange(propertyId: string, value: any) {
    this.propertyValues[propertyId] = value;
  }

  getPropertiesEntries(): [string, DaffDevToolsDriverProperty][] {
    if (!this.selectedDriver?.properties) {
      return [];
    }
    return Array.from(this.selectedDriver.properties.entries());
  }

  get isMagentoDriver(): boolean {
    return this.selectedDriver?.id?.toLowerCase().includes('magento') || false;
  }

  onApplyChanges() {
    if (this.selectedDriver) {
      const selectedDriverData: DaffDevToolsSelectedDriver = {
        id: this.selectedDriver.id,
        properties: { ...this.propertyValues },
      };

      this.applyChanges.emit({
        driverName: this.driver.name,
        newDriver: selectedDriverData,
      });
    }
  }

  onResetToDefault() {
    this.resetToDefault.emit(this.driver.name);
  }
}
