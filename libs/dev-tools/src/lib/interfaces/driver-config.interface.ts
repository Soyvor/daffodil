import { DaffDevToolsDriver } from './driver';

export interface DaffDriverConfig {
  /**
   * Display name for the driver section
   */
  name: string;

  /**
   * Currently active driver ID
   */
  currentDriver: string;

  /**
   * List of available drivers that can be switched to
   */
  availableDrivers: DaffDevToolsDriver[];

  /**
   * Stored configurations for all drivers (keyed by driver ID)
   * This allows preserving user settings when switching between drivers
   */
  storedConfigurations?: Record<string, Record<string, any>>;

  /**
   * Optional custom message to display for this driver section
   */
  message?: DaffDriverMessage;

  /**
   * Optional callback when apply changes is clicked
   */
  onApplyChanges?: () => void | Promise<void>;

  /**
   * Optional callback when reset to default is clicked
   */
  onResetToDefault?: () => void | Promise<void>;
}

export interface DaffDriverMessage {
  /**
   * The type of message (info, warning, error, success)
   */
  type: 'info' | 'warning' | 'error' | 'success';

  /**
   * The title of the message
   */
  title: string;

  /**
   * The body text of the message
   */
  text: string;

  /**
   * Optional link to include with the message
   */
  link?: {
    text: string;
    url: string;
  };
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
