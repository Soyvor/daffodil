import { TestBed } from '@angular/core/testing';

import {
  provideDaffDevTools,
  withDriverConfig,
} from './dev-tools.provider';
import { DaffDevToolsDriver } from '../interfaces/driver';
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
    const inMemoryDriver: DaffDevToolsDriver = {
      id: 'in-memory',
      name: 'In-Memory Driver',
      properties: new Map(),
    };

    const magentoDriver: DaffDevToolsDriver = {
      id: 'magento',
      name: 'Magento Driver',
      properties: new Map([
        ['baseUrl', { type: 'input', id: 'baseUrl', label: 'Base URL', placeholder: 'https://example.com/graphql' }],
      ]),
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideDaffDevTools(
            { enabled: true },
            withDriverConfig({
              name: 'Product Driver',
              status: 'connected',
              currentDriver: 'in-memory',
              availableDrivers: [inMemoryDriver, magentoDriver],
            }),
          ),
        ],
      });
    });

    it('should include driver config in the configuration', () => {
      const config = TestBed.inject(DAFF_DEV_TOOLS_CONFIG);
      expect(config.drivers).toHaveSize(1);
      expect(config.drivers[0].name).toBe('Product Driver');
      expect(config.drivers[0].status).toBe('connected');
      expect(config.drivers[0].currentDriver.id).toBe('in-memory');
      expect(config.drivers[0].availableDrivers).toEqual([inMemoryDriver, magentoDriver]);
    });

    it('should configure the service with driver config', () => {
      const service = TestBed.inject(DaffDevToolsConfigService);
      expect(service).toBeDefined();
    });
  });

  describe('with multiple driver configs', () => {
    const inMemoryDriver: DaffDevToolsDriver = {
      id: 'in-memory',
      name: 'In-Memory Driver',
      properties: new Map(),
    };

    const magentoDriver: DaffDevToolsDriver = {
      id: 'magento',
      name: 'Magento Driver',
      properties: new Map(),
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideDaffDevTools(
            { enabled: true },
            withDriverConfig({
              name: 'Product Driver',
              status: 'connected',
              currentDriver: 'in-memory',
              availableDrivers: [inMemoryDriver, magentoDriver],
            }),
            withDriverConfig({
              name: 'Cart Driver',
              status: 'disconnected',
              currentDriver: 'magento',
              availableDrivers: [inMemoryDriver, magentoDriver],
            }),
          ),
        ],
      });
    });

    it('should include all driver configs', () => {
      const config = TestBed.inject(DAFF_DEV_TOOLS_CONFIG);
      expect(config.drivers).toHaveSize(2);
      expect(config.drivers[0].name).toBe('Product Driver');
      expect(config.drivers[1].name).toBe('Cart Driver');
      expect(config.drivers[0].currentDriver.id).toBe('in-memory');
      expect(config.drivers[1].currentDriver.id).toBe('magento');
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
      const testDriver: DaffDevToolsDriver = {
        id: 'test',
        name: 'Test Driver',
        properties: new Map(),
      };

      const mockDriver: DaffDevToolsDriver = {
        id: 'mock',
        name: 'Mock Driver',
        properties: new Map(),
      };

      const feature = withDriverConfig({
        name: 'Test Driver',
        status: 'connected',
        currentDriver: 'test',
        availableDrivers: [testDriver, mockDriver],
      });

      expect(feature).toBeDefined();
      expect(feature.kind).toBe('driver-config');
      expect(feature.driverConfig.name).toBe('Test Driver');
      expect(feature.driverConfig.status).toBe('connected');
      expect(feature.driverConfig.currentDriver.id).toBe('test');
      expect(feature.driverConfig.availableDrivers).toEqual([testDriver, mockDriver]);
    });
  });
});
