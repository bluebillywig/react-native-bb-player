import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'React Native Player SDK',
  tagline: 'Native video player for React Native — powered by Blue Billywig',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://bluebillywig.github.io',
  baseUrl: '/react-native-bb-player/',

  organizationName: 'bluebillywig',
  projectName: 'react-native-bb-player',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/bluebillywig/react-native-bb-player/tree/master/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'React Native Player SDK',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'api',
          position: 'left',
          label: 'API Reference',
        },
        {
          href: 'https://bluebillywig.github.io/channel/',
          label: 'BB Channels',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/@bluebillywig/react-native-bb-player',
          label: 'npm',
          position: 'right',
        },
        {
          href: 'https://github.com/bluebillywig/react-native-bb-player',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/docs/getting-started' },
            { label: 'API Reference', to: '/docs/api/components' },
            { label: 'Feature Matrix', to: '/docs/feature-matrix' },
          ],
        },
        {
          title: 'Guides',
          items: [
            { label: 'Expo Setup', to: '/docs/guides/expo-setup' },
            { label: 'Advertising', to: '/docs/guides/advertising' },
            { label: 'Shorts', to: '/docs/guides/shorts' },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'BB Channels',
              href: 'https://bluebillywig.github.io/channel/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/bluebillywig/react-native-bb-player',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@bluebillywig/react-native-bb-player',
            },
            {
              label: 'Blue Billywig',
              href: 'https://www.bluebillywig.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Blue Billywig. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'ruby', 'swift', 'kotlin', 'xml-doc'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
