/**
 * Magento GraphQL possible types configuration for Apollo Client.
 *
 * This object defines the possible concrete types for each GraphQL interface
 * used in Magento's GraphQL API. Apollo Client uses this information for
 * proper fragment matching and union/interface type resolution.
 *
 * When Apollo Client encounters a GraphQL interface or union type in a query,
 * it needs to know which concrete types can implement that interface to
 * properly cache and normalize the data.
 *
 * @example
 * ```typescript
 * new InMemoryCache({
 *   possibleTypes: MAGENTO_POSSIBLE_TYPES
 * })
 * ```
 */
export const MAGENTO_POSSIBLE_TYPES = {
  CartAddressInterface: [
    'BillingCartAddress',
    'ShippingCartAddress',
  ],
  CartItemInterface: [
    'SimpleCartItem',
    'VirtualCartItem',
    'DownloadableCartItem',
    'BundleCartItem',
    'ConfigurableCartItem',
  ],
  ProductInterface: [
    'VirtualProduct',
    'SimpleProduct',
    'DownloadableProduct',
    'BundleProduct',
    'GroupedProduct',
    'ConfigurableProduct',
  ],
  CategoryInterface: [
    'CategoryTree',
  ],
  MediaGalleryInterface: [
    'ProductImage',
    'ProductVideo',
  ],
  ProductLinksInterface: [
    'ProductLinks',
  ],
  CreditMemoItemInterface: [
    'DownloadableCreditMemoItem',
    'BundleCreditMemoItem',
    'CreditMemoItem',
  ],
  OrderItemInterface: [
    'DownloadableOrderItem',
    'BundleOrderItem',
    'OrderItem',
  ],
  InvoiceItemInterface: [
    'DownloadableInvoiceItem',
    'BundleInvoiceItem',
    'InvoiceItem',
  ],
  ShipmentItemInterface: [
    'BundleShipmentItem',
    'ShipmentItem',
  ],
  AggregationOptionInterface: [
    'AggregationOption',
  ],
  LayerFilterItemInterface: [
    'LayerFilterItem',
    'SwatchLayerFilterItem',
  ],
  PhysicalProductInterface: [
    'SimpleProduct',
    'BundleProduct',
    'GroupedProduct',
    'ConfigurableProduct',
  ],
  CustomizableOptionInterface: [
    'CustomizableAreaOption',
    'CustomizableDateOption',
    'CustomizableDropDownOption',
    'CustomizableMultipleOption',
    'CustomizableFieldOption',
    'CustomizableFileOption',
    'CustomizableRadioOption',
    'CustomizableCheckboxOption',
  ],
  CustomizableProductInterface: [
    'VirtualProduct',
    'SimpleProduct',
    'DownloadableProduct',
    'BundleProduct',
    'ConfigurableProduct',
  ],
  SwatchDataInterface: [
    'ImageSwatchData',
    'TextSwatchData',
    'ColorSwatchData',
  ],
  SwatchLayerFilterItemInterface: [
    'SwatchLayerFilterItem',
  ],
};
