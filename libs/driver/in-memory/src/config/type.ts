export interface DaffInMemoryDriverConfig {
  /**
   * The base path segment of the API route.
   */
  apiBase: string;

  /**
   * When enabled, requests that do not match any configured backend
   * will be automatically forwarded to the provided backend endpoint.
   *
   * This acts as a "catch-all" or fallback mechanism, ensuring that
   * unknown or unconfigured routes are still proxied instead of being
   * rejected.
   */
  passThroughUnknownRequests?: boolean;
}
