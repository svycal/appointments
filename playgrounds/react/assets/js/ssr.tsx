import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Page, PageProps } from '@inertiajs/core';
import { createInertiaApp } from '@inertiajs/react';

export function render(page: Page<PageProps>) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: async (name) => {
      return await import(`./pages/${name}.tsx`);
    },
    setup: ({ App, props }) => <App {...props} />,
  });
}
