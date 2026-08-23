
import { DEFAULT_PRODUCT_IMAGE, DEFAULT_PRODUCT_VIDEO } from '@/data/defaults';
import { Cover, Video } from '@/types/inventoryTypes';


export function getMediaSrcOrDefault(
  c: Cover | Video | null,
  mediaType: "video" | "image",
  useDefault: boolean = false 
): string {
  if (!c || !("url" in c) || !c.url) {
    if (!useDefault) return ""; 
    return mediaType === "video" ? DEFAULT_PRODUCT_VIDEO : DEFAULT_PRODUCT_IMAGE;
  }

  return c.url;
}
