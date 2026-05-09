import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export class NotionSchemaError extends Error {
  constructor(propName: string, reason = 'missing or wrong type') {
    super(`NotionSchemaError: property "${propName}" is ${reason}`);
    this.name = 'NotionSchemaError';
  }
}

type Props = PageObjectResponse['properties'];
type Prop = Props[string];

/** Extract plain text from a title or rich_text property. Throws if missing/empty. */
export function plainText(prop: Prop | undefined, propName: string): string {
  if (!prop) throw new NotionSchemaError(propName);
  if (prop.type === 'title') {
    return prop.title.map((r) => r.plain_text).join('').trim();
  }
  if (prop.type === 'rich_text') {
    return prop.rich_text.map((r) => r.plain_text).join('').trim();
  }
  throw new NotionSchemaError(propName, `unexpected type "${prop.type}"`);
}

/** Extract plain text or return null if the property is absent or empty. */
export function plainTextOrNull(prop: Prop | undefined): string | null {
  if (!prop) return null;
  if (prop.type === 'title') {
    const text = prop.title.map((r) => r.plain_text).join('').trim();
    return text || null;
  }
  if (prop.type === 'rich_text') {
    const text = prop.rich_text.map((r) => r.plain_text).join('').trim();
    return text || null;
  }
  return null;
}

/** Extract a required URL property. Throws if missing or null. */
export function urlRequired(prop: Prop | undefined, propName: string): string {
  if (!prop || prop.type !== 'url' || !prop.url) {
    throw new NotionSchemaError(propName, 'missing or null url');
  }
  return prop.url;
}

/** Extract a URL property or return null if absent. */
export function urlOrNull(prop: Prop | undefined): string | null {
  if (!prop || prop.type !== 'url') return null;
  return prop.url ?? null;
}

/** Extract a required select value, validating it against an allowed set. Throws if invalid. */
export function selectRequired<T extends string>(
  prop: Prop | undefined,
  propName: string,
  allowed: readonly T[],
): T {
  if (!prop || prop.type !== 'select' || !prop.select) {
    throw new NotionSchemaError(propName, 'missing or null select');
  }
  const value = prop.select.name as T;
  if (!allowed.includes(value)) {
    throw new NotionSchemaError(propName, `unknown value "${value}"`);
  }
  return value;
}

/** Extract an optional select, returning null if absent. */
export function selectOrNull<T extends string>(
  prop: Prop | undefined,
  allowed: readonly T[],
): T | null {
  if (!prop || prop.type !== 'select' || !prop.select) return null;
  const value = prop.select.name as T;
  return allowed.includes(value) ? value : null;
}

/** Extract a checkbox value (defaults to false if prop is absent). */
export function checkbox(prop: Prop | undefined): boolean {
  if (!prop || prop.type !== 'checkbox') return false;
  return prop.checkbox;
}

/** Extract a required date property as an ISO string. Throws if missing. */
export function dateISO(prop: Prop | undefined, propName: string): string {
  if (!prop || prop.type !== 'date' || !prop.date?.start) {
    throw new NotionSchemaError(propName, 'missing or null date');
  }
  return prop.date.start;
}

/** Extract an optional date as ISO string, or null. */
export function dateISOOrNull(prop: Prop | undefined): string | null {
  if (!prop || prop.type !== 'date' || !prop.date?.start) return null;
  return prop.date.start;
}

/** Extract a required number property. Throws if missing. */
export function number(prop: Prop | undefined, propName: string): number {
  if (!prop || prop.type !== 'number' || prop.number === null || prop.number === undefined) {
    throw new NotionSchemaError(propName, 'missing or null number');
  }
  return prop.number;
}

/** Extract an optional number, returning null if absent. */
export function numberOrNull(prop: Prop | undefined): number | null {
  if (!prop || prop.type !== 'number') return null;
  return prop.number ?? null;
}

/** Extract multi_select values as a string array. Returns [] if absent. */
export function multiSelect(prop: Prop | undefined): string[] {
  if (!prop || prop.type !== 'multi_select') return [];
  return prop.multi_select.map((s) => s.name);
}

/** Extract last_edited_time as an ISO string. Throws if absent. */
export function lastEditedTime(prop: Prop | undefined, propName: string): string {
  if (!prop || prop.type !== 'last_edited_time') {
    throw new NotionSchemaError(propName, 'missing last_edited_time');
  }
  return prop.last_edited_time;
}
