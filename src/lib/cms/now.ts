import { queryAll } from '../notion';
import {
  plainText,
  plainTextOrNull,
  selectOrNull,
  lastEditedTime,
} from './map';
import type { NowSnapshot, Mood } from './types';

const MOODS: readonly Mood[] = ['calm', 'restless', 'curious', 'tired', 'inspired'];

export async function getActiveNow(): Promise<NowSnapshot> {
  const dbId = import.meta.env.NOTION_DB_NOW;
  if (!dbId) throw new Error('NOTION_DB_NOW is required but not set.');

  const pages = await queryAll(dbId, {
    filter: { property: 'active', checkbox: { equals: true } },
    sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
    page_size: 1,
  });

  if (pages.length === 0) {
    throw new Error('No active Now entry found in Notion DB.');
  }

  const page = pages[0];
  const props = page.properties;

  return {
    title: plainText(props['title'], 'title'),
    location: plainText(props['location'], 'location'),
    listening: plainTextOrNull(props['listening']),
    doing: plainTextOrNull(props['doing']),
    mood: selectOrNull<Mood>(props['mood'], MOODS),
    updatedAt: lastEditedTime(props['updatedat'], 'updatedat'),
  };
}
