export function useSlug(url: string) {
  return url.split("/platform")[1].split("/")[1];
}
