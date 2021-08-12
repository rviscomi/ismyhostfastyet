
const inlineJSON = require('../../ttfb.json');

module.exports = () => {
  return {
    url: 'https://ismyhostfastyet.com',
    inlineJSON,
    version: (new Date()).getSeconds().toString(),
    title: 'Is my host fast yet?',
    description: 'A study of web host performance using real-world transparency data from Chrome UX Report and HTTP Archive.',
    name: 'ismyhostfastyet',
    author: 'Rick Viscomi'
  };
}
