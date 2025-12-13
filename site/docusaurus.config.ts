import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  favicon: "img/favicon.ico",

  // Enable faster builds
  future: {
    experimental_faster: true,
    v4: true,
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  onBrokenLinks: "throw",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "svycal", // Usually your GitHub org/user name.
  plugins: [
    [
      "docusaurus-plugin-openapi-docs",
      {
        config: {
          api: {
            downloadUrl: "https://api.savvycal.app/v1/spec",
            hideSendButton: true,
            outputDir: "docs/api",
            showSchemas: true,
            sidebarOptions: {
              categoryLinkSource: "tag",
              groupPathsBy: "tag",
            },
            specPath: "https://api.savvycal.app/v1/spec",
          } satisfies OpenApiPlugin.Options,
        },
        docsPluginId: "classic", // configured for preset-classic
        id: "api", // plugin id
      },
    ],
  ],

  presets: [
    [
      "classic",
      {
        blog: false,
        docs: {
          docItemComponent: "@theme/ApiItem", // Derived from docusaurus-theme-openapi
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
        },
        theme: {
          customCss: "./src/css/build.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  projectName: "nova-docs", // Usually your repo name.

  tagline: "Developer documentation for the SavvyCal Appointments API",

  themeConfig: {
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} SavvyCal, Inc.`,
      links: [
        {
          items: [
            {
              label: "Home",
              to: "/",
            },
          ],
          title: "Documentation",
        },
        {
          items: [
            {
              href: "https://x.com/savvycal",
              label: "X",
            },
          ],
          title: "Community",
        },
        {
          items: [
            {
              href: "https://github.com/svycal",
              label: "GitHub",
            },
          ],
          title: "More",
        },
      ],
    },
    // Replace with your project's social card
    image: "img/default-og-image.png",
    navbar: {
      items: [
        {
          href: "/",
          label: "Home",
          position: "left",
        },
        {
          label: "API Reference",
          position: "left",
          sidebarId: "openApiSidebar",
          type: "docSidebar",
        },
      ],
      logo: {
        alt: "SavvyCal Logo",
        src: "img/logo.svg",
      },
      title: "SavvyCal Appointments",
    },
    prism: {
      additionalLanguages: ["ruby"],
      darkTheme: prismThemes.dracula,
      theme: prismThemes.github,
    },
  } satisfies Preset.ThemeConfig,

  themes: ["docusaurus-theme-openapi-docs"],

  title: "SavvyCal Appointments",
  trailingSlash: false,

  // Set the production url of your site here
  url: "https://developers.savvycal.app",
};

export default config;
