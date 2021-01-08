/**
 * @file
 * Update internal links for use on Thinkific.
 * 
 * This looks for all internal links (e.g. /tutorials/media/overview.md) and
 * tries to update them for use on Thinkific.
 *
 * If the linked .md file contains a line like
 * `<!-- thinkific-url:https://example.com -->` then grab that URL, and replace
 * the link to the .md file with a link to that URL.
 * 
 * If the linked .md file does NOT have a thinkific-url than we convert it to
 * just plain text.
 */

const fs = require('fs');
const visit = require('unist-util-visit');

module.exports = attacher;

const PWD = process.cwd();

function attacher() {
  return transformer;

  function transformer(tree, file) {
    return new Promise(async (resolve) => {
      const nodesToChange = [];

      const visitor = function replaceImagePaths(node) {
        const PWD = process.cwd();
        // We only need to worry about repository root based URLs like:
        // /tutorials/media/overview.md
        if (node.tagName === 'a' && node.properties.href.endsWith('.md') && node.properties.href.charAt(0) === '/') {
          if (!fs.existsSync(`${PWD}${node.properties.href}`)) {
            file.message(`Invalid tutorial path ${node.properties.src}`, node, 'osiolabs:thinkific-links');
          }
          else {
            nodesToChange.push(node);
          }
        }
      };

      visit(tree, 'element', visitor);

      // Looks for a line like the following and gets the URL:
      // <!-- thinkific-url:https://drupalizeme.thinkific.com/courses/take/practical-drupal-theming/texts/17522768-how-to-take-this-course -->
      const regex = /^<!--\sthinkific-url:(.*?)\s-->$/m;

      const promises = [];
      for (const node of nodesToChange) {
        const linkedTutorial = `${node.properties.href}`;
        promises.push(fs.promises.readFile(`${PWD}${linkedTutorial}`, 'utf-8').then((data) => {
          // If the file that's being linked to has a thinkific-url then we
          // replace the href with that. And if it doesn't we strip the href and
          // convert the link to plain text.
          const url = data.match(regex);
          if (url && url[1]) {
            node.properties.href = url[1];
            file.info(`Replaced link to ${linkedTutorial}`, node, 'osiolabs:thinkific-links');
          }
          else {
            // This is a little hacky, but it's the easiest way to conver this
            // to just text without having to do more complex AST manipulation
            // that would be required to replace this node entirely.
            delete node.properties;
            node.tagName = 'span';
            file.info(`Removed link to ${linkedTutorial}`, node, 'osiolabs:thinkific-links');
          }
        }));
      }

      Promise.all(promises).then(function() {
        resolve();
      });
    });
  }
};
