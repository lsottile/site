import { Client } from '@notionhq/client';
import type {
  PageObjectResponse,
  BlockObjectResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';

const token = import.meta.env.NOTION_TOKEN;
if (!token) throw new Error('NOTION_TOKEN is required but not set.');

export const notion = new Client({ auth: token, notionVersion: '2022-06-28' });

const n2m = new NotionToMarkdown({ notionClient: notion });

type QueryParams = Omit<QueryDatabaseParameters, 'database_id'>;

/** Query a DB with automatic cursor pagination, returning all page results. */
export async function queryAll(
  dbId: string,
  params?: QueryParams,
): Promise<PageObjectResponse[]> {
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.databases.query({
      database_id: dbId,
      ...params,
      ...(cursor ? { start_cursor: cursor } : {}),
    });

    for (const page of response.results) {
      if (page.object === 'page' && 'properties' in page) {
        results.push(page as PageObjectResponse);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return results;
}

/** Fetch all blocks for a page, handling pagination. */
export async function getPageBlocks(pageId: string): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      ...(cursor ? { start_cursor: cursor } : {}),
    });

    for (const block of response.results) {
      if ('type' in block) {
        blocks.push(block as BlockObjectResponse);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

/** Convert a Notion page's blocks to Markdown via notion-to-md. */
export async function pageToMarkdown(pageId: string): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  return n2m.toMarkdownString(mdBlocks).parent;
}
