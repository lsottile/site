import { queryAll } from '../notion';
import { plainText, plainTextOrNull, dateISO, selectOrNull, checkbox } from './map';
import type { Photo, Album } from './types';

const ALBUMS: readonly Album[] = ['travel', 'street', 'mountains', 'cities', 'misc'];

function buildCloudinaryUrl(cloudName: string, publicId: string): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/e_grayscale,f_auto,q_auto/${publicId}`;
}

export async function getPhotos(): Promise<Photo[]> {
  const dbId = import.meta.env.NOTION_DB_PHOTOS;
  if (!dbId) throw new Error('NOTION_DB_PHOTOS is required but not set.');

  const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error('CLOUDINARY_CLOUD_NAME is required but not set.');

  const pages = await queryAll(dbId, {
    sorts: [{ property: 'takenat', direction: 'descending' }],
  });

  const photos: Photo[] = [];

  for (const page of pages) {
    const props = page.properties;
    const title = plainText(props['title'], 'title');

    const publicId = plainTextOrNull(props['cloudinarypublicid']);
    if (!publicId) {
      console.warn(`[photos] Row "${title}" is missing cloudinarypublicid — skipping.`);
      continue;
    }

    photos.push({
      id: page.id,
      title,
      publicId,
      url: buildCloudinaryUrl(cloudName, publicId),
      location: plainTextOrNull(props['location']),
      takenAt: dateISO(props['takenat'], 'takenat'),
      album: selectOrNull<Album>(props['album'], ALBUMS),
      featured: checkbox(props['featured']),
    });
  }

  return photos.sort((a, b) => Number(b.featured) - Number(a.featured));
}
