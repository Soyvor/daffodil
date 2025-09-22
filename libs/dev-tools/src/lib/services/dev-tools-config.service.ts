import {
  Injectable,
  Inject,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { DaffDevToolsDriver } from '../interfaces/driver';
import {
  DaffDriverConfig,
  DaffDevToolsConfig,
} from '../interfaces/driver-config.interface';
import { DAFF_DEV_TOOLS_CONFIG } from '../tokens/config';

// Re-export the token for convenience
export { DAFF_DEV_TOOLS_CONFIG };

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
   * Store the current configuration for a specific driver
   * @param driverName The name of the driver section
   * @param driverId The ID of the specific driver to store config for
   * @param properties The properties to store
   */
  storeDriverConfiguration(driverName: string, driverId: string, properties: Record<string, any>): void {
    const currentDrivers = this._drivers.value;
    const driverIndex = currentDrivers.findIndex(d => d.name === driverName);

    if (driverIndex >= 0) {
      const driver = currentDrivers[driverIndex];
      const storedConfigs = driver.storedConfigurations || {};
      storedConfigs[driverId] = properties;

      currentDrivers[driverIndex] = {
        ...driver,
        storedConfigurations: storedConfigs,
      };

      this._drivers.next([...currentDrivers]);
      this.updateConfigDrivers();
    }
  }

  /**
   * Get stored configuration for a specific driver
   * @param driverName The name of the driver section
   * @param driverId The ID of the specific driver to get config for
   * @returns The stored configuration or undefined if not found
   */
  getStoredDriverConfiguration(driverName: string, driverId: string): Record<string, any> | undefined {
    const driver = this._drivers.value.find(d => d.name === driverName);
    return driver?.storedConfigurations?.[driverId];
  }

  /**
   * Switch to a different driver and restore its configuration
   * @param driverName The name of the driver section
   * @param newDriverId The ID of the driver to switch to
   */
  switchDriver(driverName: string, newDriverId: string): void {
    const currentDrivers = this._drivers.value;
    const driverIndex = currentDrivers.findIndex(d => d.name === driverName);

    if (driverIndex >= 0) {
      const driver = currentDrivers[driverIndex];

      currentDrivers[driverIndex] = {
        ...driver,
        currentDriver: newDriverId,
      };

      this._drivers.next([...currentDrivers]);
      this.updateConfigDrivers();
    }
  }

  /**
   * Get the currently selected driver for a driver section
   * @param driverName The name of the driver section
   * @returns The selected driver or null if not found
   */
  getSelectedDriver(driverName: string): DaffDevToolsDriver | null {
    const driver = this._drivers.value.find(d => d.name === driverName);
    if (!driver) {
      return null;
    }

    return driver.availableDrivers.find(d => d.id === driver.currentDriver) || null;
  }

  /**
   * Get property values for the current driver from storage
   * @param driverName The name of the driver section
   * @param driverId The ID of the driver
   * @returns Property values for the driver
   */
  getDriverPropertyValues(driverName: string, driverId: string): Record<string, any> {
    const driver = this._drivers.value.find(d => d.name === driverName);
    if (!driver) {
      return {};
    }

    // Return stored configuration (now always prefilled with defaults)
    const storedConfig = driver.storedConfigurations?.[driverId];
    return storedConfig ? { ...storedConfig } : {};
  }

  /**
   * Initialize property values for a driver from storage or defaults
   * @param driverName The name of the driver section
   * @returns Property values for the current driver
   */
  initializeDriverProperties(driverName: string): Record<string, any> {
    const driver = this._drivers.value.find(d => d.name === driverName);
    if (!driver) {
      return {};
    }

    return this.getDriverPropertyValues(driverName, driver.currentDriver);
  }

  /**
   * Reset a driver to its default property values
   * @param driverName The name of the driver section
   * @param driverId The ID of the driver to reset
   * @returns The default property values
   */
  resetDriverToDefaults(driverName: string, driverId: string): Record<string, any> {
    const driver = this._drivers.value.find(d => d.name === driverName);
    if (!driver) {
      return {};
    }

    const availableDriver = driver.availableDrivers.find(d => d.id === driverId);
    if (!availableDriver) {
      return {};
    }

    const defaultValues: Record<string, any> = {};
    if (availableDriver.properties) {
      availableDriver.properties.forEach((property, key) => {
        defaultValues[key] = property.defaultValue || '';
      });
    }

    // Store the default values
    this.storeDriverConfiguration(driverName, driverId, defaultValues);

    return defaultValues;
  }

  /**
   * Handle driver change, storing current config and loading new one
   * @param driverName The name of the driver section
   * @param previousDriverId The ID of the previous driver (to save its config)
   * @param newDriverId The ID of the new driver
   * @param currentPropertyValues The current property values to save
   * @returns Property values for the new driver
   */
  handleDriverChange(
    driverName: string,
    previousDriverId: string | null,
    newDriverId: string,
    currentPropertyValues: Record<string, any>,
  ): Record<string, any> {
    // Store current configuration if there was a previous driver
    if (previousDriverId) {
      this.storeDriverConfiguration(driverName, previousDriverId, currentPropertyValues);
    }

    // Switch to the new driver
    this.switchDriver(driverName, newDriverId);

    // Return property values for the new driver
    return this.getDriverPropertyValues(driverName, newDriverId);
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
