// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
const remarkMath = require('remark-math');
const rehypeKatex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '全志Vision',
  tagline: 'Allwinner Vision Boards Docs.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://vision.100ask.net',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: '100askTeam', // Usually your GitHub org/user name.
  projectName: 'AllwinnerVisionIC-Docs', // Usually your repo name.

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'ignore',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/100askTeam/AllwinnerVisionIC-Docs/tree/main/',
          
          sidebarCollapsed: false,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/100askTeam/AllwinnerVisionIC-Docs/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: '全志Vision',
        logo: {
          alt: '东山PI',
          src: 'img/logo.svg',
        },
        items: [         
          {
            type: 'docSidebar',
            sidebarId: 'aibasicsSidebar',
            position: 'left',
            label: '嵌入式AI基础',
          },
          {
            type: 'docSidebar',
            sidebarId: 'v853Sidebar',
            position: 'left',
            label: 'V853-AICT',
          },
          {
            type: 'docSidebar',
            sidebarId: 'v851seSidebar',
            position: 'left',
            label: 'V851se-TinyVision',
          },
          {
            type: 'docSidebar',
            sidebarId: 'v851SSidebar',
            position: 'left',
            label: 'V851s-Lizard',
          },
          {
            type: 'docSidebar',
            sidebarId: 'v821Sidebar',
            position: 'left',
            label: 'V821-AvaotaF1',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/100askTeam/AllwinnerVisionIC-Docs',
            label: 'GitHub',
            position: 'right',
          },
          
        ],
      },
      footer: {
        style: 'dark',
        links: [
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 100askTeam, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
