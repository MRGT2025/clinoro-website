import type { BlogPost } from "./site-content";

const FULL_ISO_TIMESTAMP =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;
const LOCAL_TIME = /^\d{2}:\d{2}(?::\d{2})?$/;
const DUBAI_OFFSET = "+04:00";

function isValidTimestamp(value: string) {
  return FULL_ISO_TIMESTAMP.test(value) && !Number.isNaN(Date.parse(value));
}

export function getBlogPostPublishedTime(post: BlogPost) {
  const stored = post.publishedTime?.trim() ?? "";
  if (isValidTimestamp(stored)) return stored;

  if (LOCAL_TIME.test(stored)) {
    const localTime = stored.length === 5 ? `${stored}:00` : stored;
    const combined = `${post.publishedAt}T${localTime}${DUBAI_OFFSET}`;
    if (isValidTimestamp(combined)) return combined;
  }

  const fallback = `${post.publishedAt}T09:00:00${DUBAI_OFFSET}`;
  return isValidTimestamp(fallback) ? fallback : null;
}

export function getPublishedBlogPosts(posts: BlogPost[]) {
  return posts
    .filter((post) => post.published && post.slug.trim())
    .map((post) => {
      const publishedTime = getBlogPostPublishedTime(post);
      return publishedTime ? { ...post, publishedTime } : null;
    })
    .filter((post): post is BlogPost & { publishedTime: string } => Boolean(post))
    .sort(
      (a, b) =>
        Date.parse(b.publishedTime) - Date.parse(a.publishedTime) ||
        a.slug.localeCompare(b.slug),
    );
}

export function findPublishedBlogPost(posts: BlogPost[], slug: string) {
  return getPublishedBlogPosts(posts).find((post) => post.slug === slug);
}

export function getBlogReadingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 180));
}
