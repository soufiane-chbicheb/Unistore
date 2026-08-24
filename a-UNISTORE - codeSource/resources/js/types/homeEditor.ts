import { FeedItem } from "./HomeFeedTypes";

export type MediaObject = {
  id: number;
  url: string;
  alt?: string;
};

// Orchestration metadata added by HomeFeedService
export type SectionMetadata = {
  orc_id: number;
  order: number;
};

export type Section = FeedItem & SectionMetadata;
