export function useHostname() {
  if (typeof window === "undefined") return "";

  return window.location.href;
}
