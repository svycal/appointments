import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

import {
  SidebarItem,
  SidebarItemLink,
} from "@docusaurus/plugin-content-docs/src/sidebars/types.js";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docSidebar: [
    "index",
    "data-model",
    "authentication",
    {
      items: ["embedding/booking-embed"],
      label: "Embedding",
      type: "category",
    },
    "webhooks",
  ],
  openApiSidebar: [
    {
      items: sortSchemas(
        require("./docs/api/sidebar.ts").filter(
          (item) => item.id !== "api/savvycal-appointments-api",
        ),
      ),
      label: "REST API",
      link: {
        description:
          "The API Reference provides a detailed overview of the SavvyCal API.",
        slug: "/category/rest-api",
        title: "REST API",
        type: "generated-index",
      },
      type: "category",
    },
  ],
};

/**
 * Sorts the schemas in the sidebar alphabetically.
 */
function sortSchemas(items: SidebarItem[]) {
  return items.map((item) => {
    if (item.type === "category" && item.label === "Schemas") {
      return {
        ...item,
        items: (item.items as SidebarItemLink[]).sort((a, b) =>
          a.label.localeCompare(b.label),
        ),
      };
    }

    return item;
  });
}

export default sidebars;
