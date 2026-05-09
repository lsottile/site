import { queryAll } from '../notion';
import {
  plainText,
  urlRequired,
  number,
  plainTextOrNull,
  dateISO,
  selectOrNull,
  checkbox,
} from './map';
import type { Photo, Album } from './types';

const ALBUMS: readonly Album[] = ['travel', 'street', 'mountains', 'cities', 'misc'];
const CLOUDINARY_PREFIX = 'https://res.cloudinary.com/';

export async function getPhotos(): Promise<Photo[]> {
  const dbId = import.meta.env.NOTION_DB_PHOTOS;
  if (!dbId) throw new Error('NOTION_DB_PHOTOS is required but not set.');

  const pages = await queryAll(dbId, {
    sorts: [{ property: 'takenat', direction: 'descending' }],
  });

  const photos: Photo[] = [];

  for (const page of pages) {
    const props = page.properties;

    const title = plainText(props['title'], 'title');

    let url: string;
    try {
      url = urlRequired(props['cloudinaryurl'], 'cloudinaryurl');
    } catch {
      console.warn(`[photos] Row "${title}" is missing cloudinaryurl — skipping.`);
      continue;
    }

    if (!url.startsWith(CLOUDINARY_PREFIX)) {
      console.warn(
        `[photos] Row "${title}" has a non-Cloudinary URL (${url}) — skipping.`,
      );
      continue;
    }

    photos.push({
      id: page.id,
      title,
      url,
      width: number(props['cloudinarywidth'], 'cloudinarywidth'),
      height: number(props['cloudinaryheight'], 'cloudinaryheight'),
      alt: plainText(props['alt'], 'alt'),
      location: plainTextOrNull(props['location']),
      takenAt: dateISO(props['takenat'], 'takenat'),
      album: selectOrNull<Album>(props['album'], ALBUMS),
      featured: checkbox(props['featured']),
    });
  }

  // Pin featured photos to the top
  return photos.sort((a, b) => Number(b.featured) - Number(a.featured));
}
