import type { MetadataRoute } from 'next';

// AI/answer-engine crawlers we explicitly welcome (AEO posture). Listed by name
// (rather than relying solely on the `*` group) so the intent is documented and
// honoured by crawlers that only obey a named group. Complements /llms.txt.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: 'https://sweetlife.cafe/sitemap.xml',
  };
}
