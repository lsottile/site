/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly NOTION_TOKEN: string;
  readonly NOTION_DB_NOW: string;
  readonly NOTION_DB_PHOTOS: string;
  readonly NOTION_DB_MUSIC: string;
  readonly NOTION_DB_ARTICLES: string;
  readonly REVALIDATE_TOKEN: string;
  readonly CLOUDINARY_CLOUD_NAME: string;
  readonly SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
