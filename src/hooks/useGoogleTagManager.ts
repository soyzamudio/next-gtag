import { useCallback } from "react";
import type { GTMDataLayerEvent } from "../types";

// Type guard to check if value is a Record<string, unknown>
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const useGoogleTagManager = () => {
  const init = useCallback((params: GTMDataLayerEvent) => {
    window.dataLayer = window.dataLayer || [];

    const gtmEvent: GTMDataLayerEvent = {
      "gtm.start": Date.now(),
      event: "gtm.js",
    };

    window.dataLayer.push(gtmEvent);

    const script = document.createElement("script");
    script.id = "gtm-script";
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];
      var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl${
        params.auth ? `+'&gtm_auth=${params.auth}'` : ""
      }${params.preview ? `+'&gtm_preview=${params.preview}'` : ""};
      f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${params.id}');
    `;
    document.head.appendChild(script);

    if (params.dataLayer && isRecord(params.dataLayer)) {
      window.dataLayer.push(params.dataLayer);
    }
  }, []);

  const initWorker = useCallback((params: GTMDataLayerEvent) => {
    window.dataLayer = window.dataLayer || [];

    const partytownScript = document.createElement("script");
    partytownScript.id = "partytown-config";
    partytownScript.innerHTML = `partytown = { forward: ['dataLayer.push'] }`;
    document.head.appendChild(partytownScript);

    const gtmScript = document.createElement("script");
    gtmScript.id = "gtm-worker-script";
    gtmScript.type = "text/partytown";
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];
      var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl${
        params.auth ? `+'&gtm_auth=${params.auth}'` : ""
      }${params.preview ? `+'&gtm_preview=${params.preview}'` : ""};
      f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${params.id}');
    `;
    document.head.appendChild(gtmScript);

    if (params.dataLayer && isRecord(params.dataLayer)) {
      window.dataLayer.push(params.dataLayer);
    }
  }, []);

  return {
    init,
    initWorker,
  } as const;
};
