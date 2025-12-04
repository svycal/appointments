import { createInertiaApp } from "@inertiajs/react";
import axios from "axios";
import React, { ReactNode } from "react";
import { createRoot } from "react-dom/client";

import { RootLayout } from "./layouts/root-layout";

axios.defaults.xsrfHeaderName = "x-csrf-token";

createInertiaApp({
  resolve: async (name) => {
    const page = await import(`./pages/${name}.tsx`);

    page.default.layout =
      page.default.layout ||
      ((page: ReactNode) => <RootLayout>{page}</RootLayout>);

    return page;
  },
  setup({ App, el, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
