"use client";

import { useGoogleTag } from "../hooks/useGoogleTag";
import { useEffect } from "react";
import { GoogleAnalyticsProps } from "../types";

export default function GoogleAnalytics({
  GA_MEASUREMENT_ID,
  dataLayer,
}: GoogleAnalyticsProps) {
  const { init } = useGoogleTag();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      console.warn(
        "GA_MEASUREMENT_ID is required for GoogleAnalytics component"
      );
      return;
    }

    init({
      id: GA_MEASUREMENT_ID,
      dataLayer: {
        page_path: window.location.pathname,
        ...dataLayer,
      },
    });
  }, [GA_MEASUREMENT_ID, dataLayer, init]);

  return null;
}
