export function useSlug(url: string) {
  if (url && url.includes("/platform")) {
    return url.split("/platform")[1].split("/")[1];
  } else {
    return null;
  }
}
