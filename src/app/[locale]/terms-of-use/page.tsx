import React from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import fs from 'node:fs/promises';

export default async function Page() {
  const text = await fs.readFile('static/terms-of-use.md', 'utf-8');

  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(text);

  return (
    <div className="container p-4">
      <article
        className="text-muted-foreground [&>p]:my-3 [&>h1]:text-foreground [&>h2]:text-foreground [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:text-3xl
        [&>ol]:list-decimal [&>ol]:pl-8 [&>h2]:font-semibold [&>h2]:leading-9 [&>h2]:text-lg
        [&>hr]:my-6 [&>hr]:h-0.5"
        dangerouslySetInnerHTML={{ __html: String(file) }}
      />
    </div>
  );
}
