/**
 * @file
 * Transform <img> src attributes to use https://drupalize.me URLs.
 *
 * When outputting HTML for thinkific we can deal with relative images in the
 * Markdown by rewriting the URL of the image to point to Drupalize.Me.
 *
 * See https://www.huy.dev/2018-05-remark-gatsby-plugin-part-3/ for details
 * about writing async unified plugins like this.
 */

const fs = require('fs');
const path = require('path');
const visit = require('unist-util-visit');
const checkLinks = require('check-links');

module.exports = attacher;

function attacher() {
  return transformer;

  function transformer(tree, file) {
    return new Promise(async (resolve) => {
      const nodesToChange = [];

      const visitor = function replaceImagePaths(node) {
        const PWD = process.cwd();
        // We only need to worry about repository root based URLs like:
        // - /assets/media/images/my-image.png
        if (node.tagName === 'img' && node.properties.src.charAt(0) === '/') {
          if (!fs.existsSync(`${PWD}${node.properties.src}`)) {
            file.message(
              `Invalid image path ${node.properties.src}`,
              node,
              'osiolabs:thinkific-image'
            );
          } else {
            nodesToChange.push(node);
          }
        }
      };

      visit(tree, 'element', visitor);

      // Images are always copied to the sites/default/files/tutorials/
      // directory. So as long as this tutorial has been imported to d.me
      // the image should exist.
      // Example: https://drupalize.me/sites/default/files/tutorials/block-layout-regions-shown.jpg
      for (const node of nodesToChange) {
        const newSrc =
          'https://drupalize.me/sites/default/files/tutorials/' +
          path.basename(node.properties.src);
        const results = await checkLinks([newSrc]);
        if (results[newSrc].status == 'alive') {
          file.info(
            `Updated image src from ${node.properties.src} to ${newSrc}`,
            node,
            'osiolabs:thinkific-image'
          );
          node.properties.src = newSrc;
          node.properties.class = ['fr-fic fr-dii'];
        } else {
          file.message(
            `Invalid URL generated for <img> tag: ${newSrc}`,
            node,
            'osiolabs:thinkific-image'
          );
        }
      }

      resolve();
    });
  }
}
