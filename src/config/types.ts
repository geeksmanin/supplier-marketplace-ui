import { AppConfig as BaseAppConfig } from '@geeksman/core-ui';

export interface SupplierMarketplaceCustomConfig {
  ticketingApiBaseUrl?: string;
  commentsApiBaseUrl?: string;
  notificationApiBaseUrl?: string;
}

export type AppConfig = BaseAppConfig<SupplierMarketplaceCustomConfig>;
