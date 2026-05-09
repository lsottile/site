import { queryAll } from '../notion';
import {
  plainText,
  selectRequired,
  urlOrNull,
  plainTextOrNull,
  dateISO,
} from './map';
import type { MusicEntry, MusicKind, MusicStatus } from './types';

const KINDS: readonly MusicKind[] = ['track', 'album', 'playlist', 'artist'];
const STATUSES: readonly MusicStatus[] = ['now', 'favorite', 'archive'];

export async function getMusic(status?: MusicStatus): Promise<MusicEntry[]> {
  const dbId = import.meta.env.NOTION_DB_MUSIC;
  if (!dbId) throw new Error('NOTION_DB_MUSIC is required but not set.');

  const filter = status
    ? { property: 'status', select: { equals: status } }
    : undefined;

  const pages = await queryAll(dbId, {
    ...(filter ? { filter } : {}),
    sorts: [{ property: 'addedat', direction: 'descending' }],
  });

  return pages.map((page) => {
    const props = page.properties;
    return {
      id: page.id,
      title: plainText(props['title'], 'title'),
      artist: plainText(props['artist'], 'artist'),
      kind: selectRequired<MusicKind>(props['kind'], 'kind', KINDS),
      status: selectRequired<MusicStatus>(props['status'], 'status', STATUSES),
      url: urlOrNull(props['url']),
      coverUrl: urlOrNull(props['coverurl']),
      note: plainTextOrNull(props['note']),
      addedAt: dateISO(props['addedat'], 'addedat'),
    };
  });
}
