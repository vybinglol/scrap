// Best-effort Mac detection, client-only. Used to feature the right CTA — but
// both download and web links are always available regardless.

export function isMac(): boolean {
  if (typeof navigator === "undefined") return false;

  const uaData = (navigator as Navigator & {
    userAgentData?: { platform?: string };
  }).userAgentData;
  if (uaData?.platform) return /mac/i.test(uaData.platform);

  return /mac/i.test(navigator.platform || navigator.userAgent);
}
