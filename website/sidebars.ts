import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'getting-started',
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/expo-setup',
        'guides/fullscreen',
        'guides/advertising',
        'guides/analytics',
        'guides/shorts',
        'guides/outstream',
        'guides/deep-linking',
      ],
    },
    'feature-matrix',
    'new-architecture',
    'troubleshooting',
  ],
  api: [
    'api/components',
    'api/methods',
    'api/events',
    'api/types',
  ],
};

export default sidebars;
