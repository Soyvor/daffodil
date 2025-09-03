import {
  Injectable,
  InjectionToken,
  Inject,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import {
  DaffDriverConfig,
  DaffDevToolsConfig,
} from '../interfaces/driver-config.interface';

/**
 * Injection token for dev tools configuration
 */
export const DAFF_DEV_TOOLS_CONFIG = new InjectionToken<DaffDevToolsConfig>('DAFF_DEV_TOOLS_CONFIG');

/**
 * Service for managing dev tools configuration and driver registrations
 */
@Injectable()
export class DaffDevToolsConfigService {
  private readonly _drivers = new BehaviorSubject<DaffDriverConfig[]>([]);
  private readonly _config = new BehaviorSubject<DaffDevToolsConfig>({
    drivers: [],
    enabled: true,
    startCollapsed: true,
  });

  constructor(@Inject(DAFF_DEV_TOOLS_CONFIG) config: DaffDevToolsConfig) {
    this.setConfig(config);
  }

  /**
   * Observable of all registered driver configurations
   */
  readonly drivers$: Observable<DaffDriverConfig[]> = this._drivers.asObservable();

  /**
   * Observable of the complete dev tools configuration
   */
  readonly config$: Observable<DaffDevToolsConfig> = this._config.asObservable();

  /**
   * Get current driver configurations
   */
  getDrivers(): DaffDriverConfig[] {
    return this._drivers.value;
  }

  /**
   * Get current dev tools configuration
   */
  getConfig(): DaffDevToolsConfig {
    return this._config.value;
  }

  /**
   * Get observable for a specific driver configuration by name
   */
  getDriverConfig(name: string): Observable<DaffDriverConfig | undefined> {
    return this.drivers$.pipe(
      map(drivers => drivers.find(driver => driver.name === name)),
    );
  }

  /**
   * Register a driver configuration
   */
  registerDriver(config: DaffDriverConfig): void {
    const currentDrivers = this._drivers.value;
    const existingIndex = currentDrivers.findIndex(d => d.name === config.name);

    if (existingIndex >= 0) {
      // Update existing driver
      currentDrivers[existingIndex] = config;
    } else {
      // Add new driver
      currentDrivers.push(config);
    }

    this._drivers.next([...currentDrivers]);
    this.updateConfigDrivers();
  }

  /**
   * Unregister a driver by name
   */
  unregisterDriver(name: string): void {
    const currentDrivers = this._drivers.value.filter(d => d.name !== name);
    this._drivers.next(currentDrivers);
    this.updateConfigDrivers();
  }

  /**
   * Update a specific driver configuration
   */
  updateDriver(name: string, updates: Partial<DaffDriverConfig>): void {
    const currentDrivers = this._drivers.value;
    const driverIndex = currentDrivers.findIndex(d => d.name === name);

    if (driverIndex >= 0) {
      currentDrivers[driverIndex] = { ...currentDrivers[driverIndex], ...updates };
      this._drivers.next([...currentDrivers]);
      this.updateConfigDrivers();
    }
  }

  /**
   * Set the complete dev tools configuration
   */
  setConfig(config: Partial<DaffDevToolsConfig>): void {
    const currentConfig = this._config.value;
    const newConfig = { ...currentConfig, ...config };
    this._config.next(newConfig);

    if (config.drivers) {
      this._drivers.next([...config.drivers]);
    }
  }

  /**
   * Update the drivers in the main config when drivers array changes
   */
  private updateConfigDrivers(): void {
    const currentConfig = this._config.value;
    this._config.next({
      ...currentConfig,
      drivers: this._drivers.value,
    });
  }
}
