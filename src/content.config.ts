import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Knowledgebase collection schema
const knowledgebaseCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/knowledgebase" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

// Homepage schema
const homepage = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/homepage" }),
  schema: z.object({
    banner: z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      image: z.string().optional(),
      button: z.object({
        label: z.string(),
        link: z.string().default("#"),
        enable: z.boolean().default(true)
      })
    }).optional(),
    feature: z.object({
      title: z.string().optional(),
      features: z.array(z.object({name: z.string().optional(), icon: z.string().optional(), content: z.string().optional()})),
    }).optional(),
    // Present in the homepage frontmatter all along. It survived only because
    // this collection was implicit and unvalidated; declaring the collection
    // applies the schema for the first time, and Zod drops what it does not know.
    reading_list: z.object({
      title: z.string().optional(),
      books: z.array(z.object({
        title: z.string(),
        image: z.string().optional(),
        link: z.string().optional(),
      })),
    }).optional(),
    services: z.array(z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      images: z.array(z.string()).optional(),
      button: z.object({
        label: z.string(),
        link: z.string().default("#"),
        enable: z.boolean().default(true)
      }).optional()
    })).optional(),
    workflow: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string()
    }).optional(),
    call_to_action: z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      image: z.string(),
      button: z.object({
        label: z.string(),
        link: z.string().default("#"),
        enable: z.boolean().default(true)
      }).optional()
    }).optional()
  }),
});

// Post collection schema
const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    pubDatetime: z.date().optional(),
    image: z.string().optional(),
    author: z.string().optional(),
    authors: z.array(z.string()).default(["admin"]),
    categories: z.array(z.string()).default(["others"]),
    tags: z.array(z.string()).default(["others"]),
    relatedPosts: z.array(z.string()).optional(),
    canonical: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

// Pages collection schema
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    layout: z.string().optional(),
    noindex: z.boolean().optional(),
    draft: z.boolean().optional(),
  }),
});

//Contact collection schema
const contact_page = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/contact" }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
    info: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      contacts: z.array(z.string()).optional()
    }).optional()
  })
})

//faq page schema
const faq_page = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/faq" }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
    faqs: z.array(z.object({
      title: z.string(),
      answer: z.string(),
    })).optional()
  })
})

//pricing page schema
const pricing_page = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pricing" }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
    plans: z.array(z.object({
      title: z.string(),
      subtitle: z.string(),
      price: z.number(),
      recommended: z.boolean().optional(),
      type: z.string(),
      features: z.array(z.string()).optional(),
      button: z.object({
        label: z.string(),
        link: z.string().default("#"),
        enable: z.boolean().default(true)
      })
    })).optional(),
    call_to_action: z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      image: z.string(),
      button: z.object({
        label: z.string(),
        link: z.string().default("#"),
        enable: z.boolean().default(true)
      }).optional()
    }).optional()
  })
})

// Interface for content
export interface PageData {
  blog: string,
  pages: string,
  // homePage: string,
  // contact: string,
  // faq: string,
  // pricing: string
}


// Export collections
export const collections = {
  blog: postsCollection,
  pages: pagesCollection,
  knowledgebase: knowledgebaseCollection,
  // Declared because the Content Layer has no implicit collections, and
  // getEntry("homepage", "index") reads it on the front page.
  homepage: homepage,
  // contact: contact_page,
  // faq: faq_page,
  // pricing: pricing_page
};
