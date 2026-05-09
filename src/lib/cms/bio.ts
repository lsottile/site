import { queryAll } from '../notion';
import { plainText, plainTextOrNull } from './map';

export interface BioData {
  name: string;
  tagline: string | null;
  body: string | null;
}

export async function getBio(): Promise<BioData> {
  const dbId = import.meta.env.NOTION_DB_BIO;
  if (!dbId) throw new Error('NOTION_DB_BIO is required but not set.');

  const pages = await queryAll(dbId, { page_size: 1 });
  if (pages.length === 0) throw new Error('No bio entry found in Notion DB.');

  const page = pages[0];
  const props = page.properties;

  return {
    name: plainText(props['title'], 'title'),
    tagline: plainTextOrNull(props['tagline']),
    body: plainTextOrNull(props['body']),
  };
}
