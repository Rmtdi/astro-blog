import { defineConfig, passthroughImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import astroExpressiveCode from 'astro-expressive-code';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import icon from "astro-icon";
import react from "@astrojs/react";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import mermaid from './src/plugins/mermaid.mjs';
import rehypeLazyLoadImage from './src/plugins/lazyLoadImage.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  image: {
    service: passthroughImageService(),
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeLazyLoadImage],
    syntaxHighlight: false
  },
  integrations: [mermaid(), astroExpressiveCode({
    themes: ['github-light', 'github-dark'],
    useDarkModeMediaQuery: false,
    themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
    plugins: [pluginCollapsibleSections(), pluginLineNumbers()]
  }), mdx(), sitemap(), icon(), react()],
});
