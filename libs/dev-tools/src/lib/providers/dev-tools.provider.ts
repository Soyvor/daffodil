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
export function withDriverConfig(driverConfig: DaffDriverConfig): DaffDevToolsDriverConfigFeature {
  return {
    kind: 'driver-config',
    driverConfig,
  };
}

/**
 * Configuration function for Daffodil Dev Tools
 */
export function provideDaffDevTools(
  config?: Partial<DaffDevToolsConfig>,
  ...features: DaffDevToolsFeature[]
): (Provider | EnvironmentProviders)[] {
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
