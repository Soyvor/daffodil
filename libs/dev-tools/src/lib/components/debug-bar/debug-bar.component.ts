import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  HostBinding,
  inject,
} from '@angular/core';
import {
  Subject,
  takeUntil,
} from 'rxjs';

import { DaffDriverConfig } from '../../interfaces/driver-config.interface';
import { DaffDevToolsConfigService } from '../../services/dev-tools-config.service';
import { DaffDriverSectionComponent } from '../driver-section/driver-section.component';

@Component({
  selector: 'daff-debug-bar',
  standalone: true,
  imports: [DaffDriverSectionComponent],
  templateUrl: './debug-bar.component.html',
  styleUrls: ['./debug-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaffDebugBarComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  readonly configService = inject(DaffDevToolsConfigService, { optional: true });

  @HostBinding('class.collapsed') isCollapsed = true;
  @HostBinding('class.hidden') isHidden = false;

  drivers: DaffDriverConfig[] = [];

  ngOnInit() {
    if (!this.configService) {
      return;
    }

    // Subscribe to driver configurations
    this.configService.drivers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(drivers => {
        this.drivers = drivers;
      });

    // Subscribe to config for initial settings
    this.configService.config$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        // Component starts collapsed by default, so only expand if startCollapsed is false
        if (!config.startCollapsed) {
          this.isCollapsed = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.shiftKey && event.key === 'F12') {
      event.preventDefault();
      this.toggleVisibility();
    }
  }

  toggleDebugBar() {
    if (this.isHidden) {
      return;
    }
    this.isCollapsed = !this.isCollapsed;
  }

  hideDebugBar(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isHidden = true;
    this.isCollapsed = false;
  }

  showDebugBar() {
    this.isHidden = false;
    this.isCollapsed = true;
  }

  onApplyChanges(event: { driverName: string; newDriverId: string; properties: Record<string, any> }) {
    const driver = this.drivers.find(d => d.name === event.driverName);
    if (driver) {
      // Store the configuration for this driver
      if (this.configService) {
        this.configService.storeDriverConfiguration(event.driverName, event.newDriverId, event.properties);
        this.configService.updateDriver(event.driverName, {
          currentDriver: event.newDriverId,
        });
      }

      // Call apply changes handler if provided
      if (driver.onApplyChanges) {
        driver.onApplyChanges();
      }
    }
  }

  onResetToDefault(driverName: string) {
    const driver = this.drivers.find(d => d.name === driverName);
    if (driver) {
      const defaultDriver = driver.availableDrivers[0];

      if (this.configService) {
        // Clear stored configuration and reset to default driver
        this.configService.storeDriverConfiguration(driverName, defaultDriver.id, {});
        this.configService.updateDriver(driverName, {
          currentDriver: defaultDriver.id,
        });
      }

      if (driver.onResetToDefault) {
        driver.onResetToDefault();
      } else {
        console.log(`Resetting ${driverName} to default`);
      }
    }
  }
}
