import { TestBed } from '@angular/core/testing';

import {
  provideDaffDevTools,
  withDriverConfig,
} from './dev-tools.provider';
import { DaffDriverConfig } from '../interfaces/driver-config.interface';
import {
  DAFF_DEV_TOOLS_CONFIG,
  DaffDevToolsConfigService,
} from '../services/dev-tools-config.service';

describe('provideDaffDevTools', () => {
  describe('with basic config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideDaffDevTools({
            enabled: true,
            startCollapsed: false,
          }),
        ],
      });
    });

    it('should provide DAFF_DEV_TOOLS_CONFIG', () => {
      const config = TestBed.inject(DAFF_DEV_TOOLS_CONFIG);
      expect(config).toBeDefined();
      expect(config.enabled).toBe(true);
      expect(config.startCollapsed).toBe(false);
      expect(config.drivers).toEqual([]);
    });

    it('should provide DaffDevToolsConfigService', () => {
      const service = TestBed.inject(DaffDevToolsConfigService);
      expect(service).toBeDefined();
    });
  });

  describe('with driver config', () => {
    const mockDriverConfig: DaffDriverConfig = {
      name: 'Product Driver',
      status: 'connected',
      currentDriver: 'in-memory',
      availableDrivers: ['in-memory', 'magento'],
      metadata: { version: '1.0.0' },
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideDaffDevTools(
            { enabled: true },
            withDriverConfig(mockDriverConfig),
          ),
        ],
      });
    });

    it('should include driver config in the configuration', () => {
      const config = TestBed.inject(DAFF_DEV_TOOLS_CONFIG);
      expect(config.drivers).toHaveSize(1);
      expect(config.drivers[0]).toEqual(mockDriverConfig);
    });

    it('should configure the service with driver config', () => {
      const service = TestBed.inject(DaffDevToolsConfigService);
      expect(service).toBeDefined();
    });
  });

  describe('with multiple driver configs', () => {
    const productDriverConfig: DaffDriverConfig = {
      name: 'Product Driver',
      status: 'connected',
      currentDriver: 'in-memory',
      availableDrivers: ['in-memory', 'magento'],
    };

    const cartDriverConfig: DaffDriverConfig = {
      name: 'Cart Driver',
      status: 'disconnected',
      currentDriver: 'magento',
      availableDrivers: ['in-memory', 'magento'],
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideDaffDevTools(
            { enabled: true },
            withDriverConfig(productDriverConfig),
            withDriverConfig(cartDriverConfig),
          ),
        ],
      });
    });

    it('should include all driver configs', () => {
      const config = TestBed.inject(DAFF_DEV_TOOLS_CONFIG);
      expect(config.drivers).toHaveSize(2);
      expect(config.drivers).toContain(productDriverConfig);
      expect(config.drivers).toContain(cartDriverConfig);
    });
  });

  describe('default configuration', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideDaffDevTools()],
      });
    });

    it('should use default values when no config provided', () => {
      const config = TestBed.inject(DAFF_DEV_TOOLS_CONFIG);
      expect(config.drivers).toEqual([]);
      expect(config.enabled).toBeDefined();
      expect(config.startCollapsed).toBe(true);
    });
  });

  describe('withDriverConfig function', () => {
    it('should create a proper driver config feature', () => {
      const driverConfig: DaffDriverConfig = {
        name: 'Test Driver',
        status: 'connected',
        currentDriver: 'test',
        availableDrivers: ['test', 'mock'],
      };

      const feature = withDriverConfig(driverConfig);

      expect(feature).toBeDefined();
      expect(feature.kind).toBe('driver-config');
      expect(feature.driverConfig).toEqual(driverConfig);
    });
  });
});
