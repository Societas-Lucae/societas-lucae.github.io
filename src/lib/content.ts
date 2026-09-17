import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

async function singleton<C extends 'site' | 'seo' | 'navigation' | 'home'>(collection: C) {
  const entry = await getEntry(collection, collection);
  if (!entry) throw new Error(`[content] Missing settings file for "${collection}"`);
  return entry.data as CollectionEntry<C>['data'];
}

export const getSite = () => singleton('site');
export const getSeo = () => singleton('seo');
export const getNavigation = () => singleton('navigation');
export const getHome = () => singleton('home');

export type EventEntry = CollectionEntry<'events'>;
export type EventCategoryEntry = CollectionEntry<'eventCategories'>;

/** An event is "upcoming" until the end of its last day. */
export function isUpcoming(event: EventEntry, now = new Date()): boolean {
  const end = event.data.endDate ?? event.data.startDate;
  const endOfDay = new Date(end);
  endOfDay.setUTCHours(23, 59, 59, 999);
  return endOfDay.getTime() >= now.getTime();
}

export async function getPublishedEvents(): Promise<EventEntry[]> {
  const events = await getCollection('events', ({ data }) => !data.draft);
  return events.sort((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime());
}

export async function getEventCategories(): Promise<EventCategoryEntry[]> {
  const categories = await getCollection('eventCategories');
  return categories.sort((a, b) => a.data.order - b.data.order);
}

export async function getPublishedTestimonials() {
  const testimonials = await getCollection('testimonials', ({ data }) => data.published);
  return testimonials.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Drops navigation links that point to a section which is not rendered
 * (today: `#testimonials` when no testimonial is shown on the site).
 */
export async function getVisibleLinks<T extends { href: string }>(links: T[]): Promise<T[]> {
  const hasTestimonials = (await getPublishedTestimonials()).length > 0;
  return links.filter((link) => hasTestimonials || !/#testimonials$/.test(link.href));
}

const monthDay = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const full = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});
const monthYear = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** "15–18 October 2026", "30 July – 2 August 2026" or "24 February 2026". */
export function formatEventDates(event: EventEntry): string {
  const { startDate: start, endDate: end } = event.data;
  if (!end || end.getTime() === start.getTime()) return full.format(start);
  const sameMonth =
    start.getUTCMonth() === end.getUTCMonth() && start.getUTCFullYear() === end.getUTCFullYear();
  if (sameMonth) return `${start.getUTCDate()}–${end.getUTCDate()} ${monthYear.format(start)}`;
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  return sameYear
    ? `${monthDay.format(start)} – ${full.format(end)}`
    : `${full.format(start)} – ${full.format(end)}`;
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
