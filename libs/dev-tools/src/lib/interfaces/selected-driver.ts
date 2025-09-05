/**
 * Represents a driver that has been selected and configured within the Daffodil dev tools.
 * This interface contains the minimal information needed to identify and configure
 * a driver with its specific property values.
 *
 * @example
 * ```typescript
 * const selectedDriver: DaffDevToolsSelectedDriver = {
 *   id: 'magento-graphql',
 *   properties: {
 *     'api_url': 'https://my-magento-store.com/graphql',
 *     'store_code': 'default'
 *   }
 * };
 * ```
 */
export interface DaffDevToolsSelectedDriver {
  /**
   * The unique identifier of the selected driver.
   * This should correspond to an available driver's ID from the DaffDevToolsDriver interface.
   *
   * @example 'magento-graphql', 'shopify-storefront', 'demo'
   */
  id: string;

  /**
   * A key-value map containing the configured property values for this driver.
   * The keys should match the property IDs defined in the driver's properties Map,
   * and the values represent the user-configured settings.
   *
   * @example
   * {
   *   'api_url': 'https://example.com/api',
   *   'timeout': 5000,
   *   'enable_caching': true
   * }
   */
  properties: Record<string, any>;
}
