import posthog from "posthog-js"

if (typeof window !== 'undefined') {
  // Defer initialization until after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostHog);
  } else {
    initPostHog();
  }
}

function initPostHog() {
  try {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_exceptions: true,
      capture_pageview: true,
      disable_surveys: true,
      persistence: "localStorage",
      request_timeout_ms: 10000,
      enable_heatmaps: false,
      debug: process.env.NODE_ENV === "development",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error('PostHog initialization failed:', error);
    }
  }
}
