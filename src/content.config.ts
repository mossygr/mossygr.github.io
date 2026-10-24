import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    key: z.string(), lang: z.enum(['el', 'en']),
    type: z.enum(['article', 'guide', 'project']).default('article'),
    title: z.string(), description: z.string().default(''), date: z.coerce.date(),
    permalink: z.string().startsWith('/').endsWith('/'),
    categories: z.array(z.string()).default([]), tags: z.array(z.string()).default([]),
    image: z.object({ path: z.string(), alt: z.string().default('') }).optional(),
    pin: z.boolean().default(false), toc: z.boolean().default(true),
    materials: z.array(z.object({ name: z.string(), quantity: z.string().optional(), note: z.string().optional() })).optional(),
    cost: z.object({ amount: z.number().nonnegative(), currency: z.string(), asOf: z.string(), note: z.string().optional() }).optional(),
    wiring: z.array(z.object({ from: z.string(), to: z.string(), note: z.string().optional() })).optional(),
    steps: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
    downloads: z.array(z.object({ title: z.string(), href: z.string(), note: z.string().optional() })).optional(),
    troubleshooting: z.array(z.object({ problem: z.string(), solution: z.string() })).optional(),
  }),
});
export const collections = { docs };
