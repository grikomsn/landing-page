const siteConfig = require('./site-config')

module.exports = {
  siteMetadata: { ...siteConfig },
  plugins: [
    // Remark Plugins
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-autolink-headers',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-images',
          'gatsby-remark-prismjs',
          'gatsby-remark-responsive-iframe',
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-default-html-attrs',
            options: {
              h1: { className: 'title' },
            },
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: { target: '_blank', rel: 'noopener noreferrer' },
          },
        ],
      },
    },
    // Other Plugins
    'gatsby-plugin-catch-links',
    'gatsby-plugin-eslint',
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-webpack-size',
    'gatsby-transformer-json',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-purgecss',
      options: { printRejected: true },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: { rule: { include: /images/ } },
    },
    {
      resolve: 'gatsby-plugin-sass',
      options: { includePaths: ['./src/stylesheets'] },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
  ],
}
