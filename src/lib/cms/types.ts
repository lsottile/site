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

