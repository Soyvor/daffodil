/**
 * Represents an available driver in the Daffodil dev tools system.
 * Drivers are pluggable backends that provide different data sources or APIs
 * for the application (e.g., Magento GraphQL, Shopify Storefront, Demo data).
 *
 * @example
 * ```typescript
 * const magentoDriver: DaffDevToolsDriver = {
 *   id: 'magento-graphql',
 *   name: 'Magento GraphQL',
 *   disabled: false,
 *   properties: new Map([
 *     ['api_url', {
 *       id: 'api_url',
 *       label: 'GraphQL API URL',
 *       type: 'input',
 *       placeholder: 'https://your-store.com/graphql',
 *       defaultValue: 'https://demo.magento.com/graphql'
 *     }],
 *     ['store_code', {
 *       id: 'store_code',
 *       label: 'Store Code',
 *       type: 'input',
 *       placeholder: 'default',
 *       defaultValue: 'default'
 *     }]
 *   ])
 * };
 * ```
 */
export interface DaffDevToolsDriver {
  /**
   * Unique identifier for this driver.
   * Used for driver selection and configuration storage.
   *
   * @example 'magento-graphql', 'shopify-storefront', 'demo'
   */
  id: string;

  /**
   * Human-readable display name for this driver.
   * Shown in the driver selection UI.
   *
   * @example 'Magento GraphQL', 'Shopify Storefront API', 'Demo Data'
   */
  name: string;

  /**
   * Map of configurable properties for this driver.
   * Each property defines a configuration field that users can set,
   * such as API URLs, authentication tokens, or feature flags.
   *
   * The key is the property identifier, and the value defines
   * the property's metadata including label, type, and default value.
   */
  properties: Map<string, DaffDevToolsDriverProperty>;

  /**
   * Whether this driver is currently disabled and cannot be selected.
   * When true, the driver appears grayed out in the UI and cannot be activated.
   */
  disabled?: boolean;
}

/**
 * Represents a configurable property for a driver in the Daffodil dev tools.
 * Properties define the form fields that users can configure for each driver,
 * such as API endpoints, authentication credentials, or feature toggles.
 *
 * @example
 * ```typescript
 * const apiUrlProperty: DaffDevToolsDriverProperty = {
 *   id: 'api_url',
 *   label: 'API Base URL',
 *   type: 'input',
 *   placeholder: 'https://api.example.com',
 *   defaultValue: 'https://demo-api.example.com'
 * };
 *
 * const storeCodeProperty: DaffDevToolsDriverProperty = {
 *   id: 'store_code',
 *   label: 'Store Code',
 *   type: 'input',
 *   placeholder: 'Enter store code (e.g., default, us, uk)',
 *   defaultValue: 'default'
 * };
 * ```
 */
export interface DaffDevToolsDriverProperty {
  /**
   * The input field type for this property.
   * Currently only 'input' is supported, which renders as a text input field.
   *
   * @default 'input'
   */
  type: 'input';

  /**
   * The default value for this property when the driver is first selected.
   * Can be any type depending on the property's expected value format.
   *
   * @example 'https://api.example.com', 5000, true
   */
  defaultValue?: any;

  /**
   * Unique identifier for this property within the driver.
   * Used as the key when storing and retrieving property values.
   *
   * @example 'api_url', 'timeout', 'enable_debug'
   */
  id: string;

  /**
   * Human-readable label displayed next to the input field.
   * Should clearly describe what this property configures.
   *
   * @example 'API Base URL', 'Request Timeout (ms)', 'Enable Debug Mode'
   */
  label: string;

  /**
   * Optional placeholder text shown in the input field when empty.
   * Provides hints or examples of expected input format.
   *
   * @example 'https://your-store.com/api', 'Enter timeout in milliseconds'
   */
  placeholder?: string;
}
