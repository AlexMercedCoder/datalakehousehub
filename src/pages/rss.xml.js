import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';

export async function GET(context) {
  const blog = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => {
      const at = a.data.date ? a.data.date.valueOf() : 0;
      const bt = b.data.date ? b.data.date.valueOf() : 0;
      if (bt !== at) return bt - at;
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });

  function generateSummary(content, length = 150) {
    if (!content) return "";
    return content.length > length ? content.slice(0, length) + '...' : content;
  }

  return rss({
    title: 'The Data Lakehouse Hub',
    description: 'Data Lakehouse Community and Content',
    site: context.site,
    items: blog.slice(0, 20).map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: generateSummary(post.body, 300),
      author: post.data.author || post.data.authors[0],
      category: post.data.categories[0],
      link: `/blog/${post.id}/`,
      enclosure: {
        url: new URL(`/open-graph/${post.id}.png`, context.site).href,
        length: 0,
        type: 'image/png'
      }
    })),
  });
}
