import React, { ReactNode } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Page, PageProps } from '@inertiajs/core';
import { createInertiaApp } from '@inertiajs/react';
import { RootLayout } from './layouts/root-layout';

export function render(page: Page<PageProps>) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: async (name) => {
      const page = await import(`./pages/${name}.tsx`);

      page.default.layout =
        page.default.layout ||
        ((page: ReactNode) => <RootLayout>{page}</RootLayout>);

      return page;
    },
    setup: ({ App, props }) => <App {...props} />,
  });
}
