import { defineCollection, z } from 'astro:content';

// Define collections for your content
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
  }),
});

const media = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publication: z.string(),
    date: z.string(),
    url: z.string(),
    type: z.enum([
      'Article',
      'Podcast',
      'Video',
      'Conference',
      'Award',
      'Report',
    ]),
    project: z.string(),
    tags: z.array(z.string()),
    excerpt: z.string(),
    image: z.string().optional(),
  }),
});

const toolkits = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    category: z.string().optional(),
    projects: z.array(z.string()).optional(),
    status: z.enum(['Live', 'In Development', 'Beta']),
    link: z.string().optional(),
    github: z.string().optional(),
    features: z.array(z.string()),
  }),
});

const team = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    prefix: z.string().optional(),
    role: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    projects: z.array(z.string()).optional(),
    status: z.enum(['current', 'alumni']).default('current'),
    type: z.enum(['core', 'associated faculty', 'advisor']).default('core'),
    socials: z.object({
      website: z.string().optional(),
      github: z.string().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      email: z.string().optional(),
      mastodon: z.string().optional(),
      bluesky: z.string().optional(),
    }),
  }),
});

// Export a single `collections` object to register your collection(s)
export const collections = {
  blog,
  projects,
  media,
  toolkits,
  team,
};
