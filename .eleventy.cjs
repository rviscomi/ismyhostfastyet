const { writeFileSync } = require('fs');

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addGlobalData('metadata', () => {
    return {
      url: 'https://ismyhostfastyet.com',
      inlineJSON : require('./ttfb.json'),
      version: new Date().valueOf(),
      title: 'Is my host fast yet?',
      description: 'A study of web host performance using real-world transparency data from Chrome UX Report and HTTP Archive.',
      name: 'ismyhostfastyet',
      author: 'Rick Viscomi'
    }
  });
  eleventyConfig.addPassthroughCopy({ 'site/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'site/CNAME': 'CNAME' });

  eleventyConfig.on('afterBuild', () => {
    writeFileSync('docs/.nojekyll', '', 'utf8');
  });

  return {
    pathPrefix: '/',
    passthroughFileCopy: true,
    dir: {
      input: 'site',
      output: 'docs',
    },
  };
};
