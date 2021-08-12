const fs = require('fs');
const anchor = require('markdown-it-anchor');

module.exports = function (eleventyConfig) {
  let liquidJs = require('liquidjs');
  let options = {
    extname: '.liquid',
    dynamicPartials: true,
    strictFilters: false,
    root: ['site/_includes']
  };

  eleventyConfig.setLibrary('liquid', liquidJs(options));
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addPassthroughCopy({ 'site/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'site/CNAME': 'CNAME' });

  eleventyConfig.on('afterBuild', () => {
    fs.writeFileSync('docs/.nojekyll', '', 'utf8');
  });

  eleventyConfig.setLibrary(
    'md',
    require('markdown-it')({
      html: true,
      breaks: true,
      linkify: true,
    })
  .use(anchor, {
    permalink: anchor.permalink.headerLink(),
    permalinkClass: 'direct-link',
    permalinkSymbol: '¶',
  })
  );

  return {
    pathPrefix: '/',
    passthroughFileCopy: true,
    dir: {
      data: `_data`,
      input: 'site',
      includes: `_includes`,
      layouts: `_includes`,
      output: 'docs',
    },
  };
};
