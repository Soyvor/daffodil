
import { InjectionToken } from '@angular/core';

import { DaffDevToolsConfig } from '../interfaces/driver-config.interface';

/**
 * Injection token for dev tools configuration
 */
export const DAFF_DEV_TOOLS_CONFIG = new InjectionToken<DaffDevToolsConfig>('DAFF_DEV_TOOLS_CONFIG');
