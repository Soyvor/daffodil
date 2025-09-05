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
import { DaffDevToolsSelectedDriver } from '../interfaces/selected-driver';
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
export const withDriverConfig = (driverConfig: Omit<DaffDriverConfig, 'currentDriver'> & { currentDriver?: string  }): DaffDevToolsDriverConfigFeature => {
  let currentDriver: DaffDevToolsSelectedDriver;

  if (typeof driverConfig.currentDriver === 'string') {
    currentDriver = {
      id: driverConfig.currentDriver,
      properties: {},
    };
  } else {
    currentDriver = {
      id: driverConfig.availableDrivers[0]?.id || '',
      properties: {},
    };
  }

  const completeDriverConfig: DaffDriverConfig = {
    ...driverConfig,
    currentDriver,
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
    drivers: driverConfigs,
    enabled: isDevMode(),
    startCollapsed: true,
    ...config,
  };

  return [
    makeEnvironmentProviders([{
      provide: DAFF_DEV_TOOLS_CONFIG,
      useValue: defaultConfig,
    }]),
    DaffDevToolsConfigService,
  ];
};
