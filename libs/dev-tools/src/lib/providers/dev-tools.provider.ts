import {
  EnvironmentProviders,
  isDevMode,
  makeEnvironmentProviders,
  Provider,
} from '@angular/core';

import {
  DaffDevToolsConfig,
  DaffDriverConfig,
} from '../interfaces/driver-config.interface';
import { DaffDevToolsConfigService } from '../services/dev-tools-config.service';
import { DAFF_DEV_TOOLS_CONFIG } from '../tokens/config';

/**
 * Feature interface for driver configuration
 */
export type DaffDevToolsFeature = DaffDevToolsDriverConfigFeature;

/**
 * Feature interface for driver configuration
 */
export interface DaffDevToolsDriverConfigFeature {
  kind: 'driver-config';
  driverConfig: DaffDriverConfig;
}

/**
 * Helper function to create a driver configuration feature
 */
export const withDriverConfig = (driverConfig: Omit<DaffDriverConfig, 'storedConfigurations'> & { currentDriver?: string }): DaffDevToolsDriverConfigFeature => {
  const currentDriver = driverConfig.currentDriver || driverConfig.availableDrivers[0]?.id || '';

  // Prefill storedConfigurations with default values for each driver
  const storedConfigurations: Record<string, Record<string, any>> = {};

  driverConfig.availableDrivers.forEach(driver => {
    const defaultValues: Record<string, any> = {};

    if (driver.properties) {
      driver.properties.forEach((property, key) => {
        defaultValues[key] = property.defaultValue || '';
      });
    }

    storedConfigurations[driver.id] = defaultValues;
  });

  const completeDriverConfig: DaffDriverConfig = {
    ...driverConfig,
    currentDriver,
    storedConfigurations,
  };

  return {
    kind: 'driver-config',
    driverConfig: completeDriverConfig,
  };
};

/**
 * Configuration function for Daffodil Dev Tools
 */
export const provideDaffDevTools = (
  config?: Partial<DaffDevToolsConfig>,
  ...features: DaffDevToolsFeature[]
): (Provider | EnvironmentProviders)[]  => {
  const driverConfigs = features
    .filter(feature => feature.kind === 'driver-config')
    .map(feature => feature.driverConfig);

  const defaultConfig: DaffDevToolsConfig = {
    enabled: isDevMode(),
    startCollapsed: true,
    ...config,
    drivers: driverConfigs,  // Ensure drivers with storedConfigurations are not overwritten
  };

  return [
    makeEnvironmentProviders([{
      provide: DAFF_DEV_TOOLS_CONFIG,
      useValue: defaultConfig,
    }]),
    DaffDevToolsConfigService,
  ];
};
