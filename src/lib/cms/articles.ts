import { queryAll, pageToMarkdown } from '../notion';
import {
  plainText,
  selectRequired,
  urlOrNull,
  plainTextOrNull,
  dateISO,
  multiSelect,
  numberOrNull,
} from './map';
import type { ArticleSummary, Article, ArticleStatus } from './types';

const STATUSES: readonly ArticleStatus[] = ['draft', 'published', 'archived'];

function mapSummary(page: Awaited<ReturnType<typeof queryAll>>[number]): ArticleSummary {
  const props = page.properties;
  return {
    id: page.id,
    slug: plainText(props['slug'], 'slug'),
    title: plainText(props['title'], 'title'),
    excerpt: plainText(props['excerpt'], 'excerpt'),
    status: selectRequired<ArticleStatus>(props['status'], 'status', STATUSES),
    publishedAt: dateISO(props['publishedat'], 'publishedat'),
    coverUrl: urlOrNull(props['coverurl']),
    coverAlt: plainTextOrNull(props['coveralt']),
    tags: multiSelect(props['tags']),
    readingTime: numberOrNull(props['readingtime']),
  };
}

export async function listArticles(): Promise<ArticleSummary[]> {
  const dbId = import.meta.env.NOTION_DB_ARTICLES;
  if (!dbId) throw new Error('NOTION_DB_ARTICLES is required but not set.');

  const pages = await queryAll(dbId, {
    filter: { property: 'status', select: { equals: 'published' } },
    sorts: [{ property: 'publishedat', direction: 'descending' }],
  });

  return pages.map(mapSummary);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const dbId = import.meta.env.NOTION_DB_ARTICLES;
  if (!dbId) throw new Error('NOTION_DB_ARTICLES is required but not set.');

  const pages = await queryAll(dbId, {
    filter: {
      and: [
        { property: 'slug', rich_text: { equals: slug } },
        { property: 'status', select: { equals: 'published' } },
      ],
    },
    page_size: 1,
  });

  if (pages.length === 0) return null;

  const summary = mapSummary(pages[0]);
  const markdown = await pageToMarkdown(pages[0].id);

  return { ...summary, markdown };
}
