export type Mood = 'calm' | 'restless' | 'curious' | 'tired' | 'inspired';

export interface NowSnapshot {
  title: string;
  location: string;
  listening: string | null;
  doing: string | null;
  mood: Mood | null;
  updatedAt: string; // ISO 8601
}

export type Album = 'travel' | 'street' | 'mountains' | 'cities' | 'misc';

export interface Photo {
  id: string;
  title: string;
  url: string;
  width: number;
  height: number;
  alt: string;
  location: string | null;
  takenAt: string; // ISO date
  album: Album | null;
  featured: boolean;
}

export type MusicKind = 'track' | 'album' | 'playlist' | 'artist';
export type MusicStatus = 'now' | 'favorite' | 'archive';

export interface MusicEntry {
  id: string;
  title: string;
  artist: string;
  kind: MusicKind;
  status: MusicStatus;
  url: string | null;
  coverUrl: string | null;
  note: string | null;
  addedAt: string; // ISO date
}

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string; // ISO date
  coverUrl: string | null;
  coverAlt: string | null;
  tags: string[];
  readingTime: number | null;
  status: ArticleStatus;
}

export interface Article extends ArticleSummary {
  /** Markdown content rendered from Notion blocks via notion-to-md. */
  markdown: string;
}
