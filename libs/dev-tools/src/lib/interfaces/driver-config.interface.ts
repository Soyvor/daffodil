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
  currentDriver: string;

  /**
   * List of available drivers that can be switched to
   */
  availableDrivers: string[];

  /**
   * Optional callback when a driver change is requested
   */
  onDriverChange?: (newDriver: string) => void | Promise<void>;

  /**
   * Optional callback when apply changes is clicked
   */
  onApplyChanges?: () => void | Promise<void>;

  /**
   * Optional callback when reset to default is clicked
   */
  onResetToDefault?: () => void | Promise<void>;

  /**
   * Optional callback when test connection is clicked
   */
  onTestConnection?: () => void | Promise<void>;

  /**
   * Optional custom properties for the driver
   */
  metadata?: Record<string, any>;
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
