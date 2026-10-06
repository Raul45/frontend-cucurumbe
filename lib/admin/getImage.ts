export function getImageUrl(url: string) {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
}