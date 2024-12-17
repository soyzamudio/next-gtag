export type GtagCommand = "js" | "config" | "event" | "set" | "get" | "consent";

export interface GtagParams {
  id: string;
  dataLayer?: Record<string, unknown>;
}

export interface EventParams extends Record<string, unknown> {
  type: string;
}

export interface ConfigParams extends Record<string, unknown> {
  send_page_view?: boolean;
  page_path?: string;
  page_title?: string;
}

export interface ConsentParams extends Record<string, unknown> {
  analytics_storage?: "granted" | "denied";
  ad_storage?: "granted" | "denied";
  functionality_storage?: "granted" | "denied";
  personalization_storage?: "granted" | "denied";
  security_storage?: "granted" | "denied";
}

export type GtagSetParams = Record<string, unknown>;

// GTM Types
export interface GTMDataLayerEvent {
  "gtm.start"?: number;
  event?: string;
  [key: string]: unknown;
}

export interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string;
  dataLayer?: GTMDataLayerEvent;
}

export type GTMDataLayer = Array<GTMDataLayerEvent | unknown[]>;

declare global {
  interface Window {
    dataLayer: GTMDataLayer;
    gtag: (...args: [GtagCommand, ...unknown[]]) => void;
    partytown?: {
      forward: string[];
    };
  }
}
