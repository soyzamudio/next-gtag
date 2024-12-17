import { useCallback } from "react";
import type {
  GtagCommand,
  GtagParams,
  EventParams,
  ConfigParams,
  ConsentParams,
  GtagSetParams,
} from "../types";

export const useGoogleTag = () => {
  const init = useCallback((params: GtagParams) => {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${params.id}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: [GtagCommand, ...unknown[]]) {
      window.dataLayer.push(args);
    };

    window.gtag("js", new Date());
    if (params.dataLayer) {
      window.gtag("config", params.id, params.dataLayer);
    } else {
      window.gtag("config", params.id);
    }
  }, []);

  const sendEvent = useCallback((params: EventParams) => {
    const { type, ...rest } = params;
    window.gtag("event", type, rest);
  }, []);

  const config = useCallback((targetId: string, configParams: ConfigParams) => {
    window.gtag("config", targetId, configParams);
  }, []);

  const set = useCallback((params: GtagSetParams) => {
    window.gtag("set", params);
  }, []);

  const get = useCallback((target: string, fieldName: string) => {
    window.gtag("get", target, fieldName);
  }, []);

  const consent = useCallback((params: ConsentParams) => {
    window.gtag("consent", "update", params);
  }, []);

  return {
    init,
    sendEvent,
    config,
    set,
    get,
    consent,
  } as const;
};
