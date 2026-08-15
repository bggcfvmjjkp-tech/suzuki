export const GOOGLE_ADS_ID = "AW-18143133918";

const GOOGLE_ADS_CONVERSION_DESTINATION =
  `${GOOGLE_ADS_ID}/m78oCMO_86gcEN6BqctD`;

type GoogleAdsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function trackGoogleAdsConversion() {
  if (typeof window === "undefined") return;

  try {
    const googleAdsWindow = window as GoogleAdsWindow;
    googleAdsWindow.dataLayer ??= [];
    googleAdsWindow.gtag ??= (...args: unknown[]) => {
      googleAdsWindow.dataLayer?.push(args);
    };

    googleAdsWindow.gtag("event", "conversion", {
      send_to: GOOGLE_ADS_CONVERSION_DESTINATION,
    });
  } catch (error) {
    console.error("Failed to track Google Ads conversion:", error);
  }
}
