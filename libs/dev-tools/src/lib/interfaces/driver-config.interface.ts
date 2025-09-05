import { DaffDevToolsDriver } from './driver';
import { DaffDevToolsSelectedDriver } from './selected-driver';

export interface DaffDriverConfig {
  /**
   * Display name for the driver section
   */
  name: string;

  /**
   * Current status of the driver
   */
  status: 'connected' | 'disconnected';

  /**
   * Currently active driver
   */
  currentDriver: DaffDevToolsSelectedDriver;

  /**
   * List of available drivers that can be switched to
   */
  availableDrivers: DaffDevToolsDriver[];


  /**
   * Optional callback when apply changes is clicked
   */
  onApplyChanges?: () => void | Promise<void>;

  /**
   * Optional callback when reset to default is clicked
   */
  onResetToDefault?: () => void | Promise<void>;
}

export interface DaffDevToolsConfig {
  /**
   * List of driver configurations to display
   */
  drivers: DaffDriverConfig[];

  /**
   * Whether dev tools should be enabled (defaults to isDevMode())
   */
  enabled?: boolean;

  /**
   * Whether to start collapsed (defaults to true)
   */
  startCollapsed?: boolean;
}
