/**
 * SSR-safe data fetching wrapper.
 * During SSR, if fetch fails, returns empty data instead of crashing.
 * Client-side: fetches normally with full error handling.
 */
export async function ssrSafeFetch<T>(
  fetcher: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fetcher();
  } catch (err) {
    // In SSR, we can't show errors — return fallback and let client retry
    if (typeof window === "undefined") {
      console.warn("[SSR] Fetch failed, using fallback:", err);
      return fallback;
    }
    // On client, throw so error boundary/component can handle
    throw err;
  }
}
