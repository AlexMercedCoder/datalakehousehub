import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date - a.data.date);

  function generateSummary(content, length = 150) {
    return content.length > length ? content.slice(0, length) + '...' : content;
  }

  return rss({
    title: 'The Data Lakehouse Hub',
    description: 'Data Lakehouse Community and Content',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: generateSummary(post.body, 150),
      author: post.data.author || post.data.authors[0],
      category: post.data.categories[0],
      link: `/blog/${post.slug}/`,
      content: post.body,
    })),
  });
}
