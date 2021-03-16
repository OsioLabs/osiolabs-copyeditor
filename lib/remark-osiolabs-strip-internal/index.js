/**
 * @file
 * remark plugin that removes everything in an MDAST tree after an html comment
 * like <!-- internal -->.
 *
 * For Osio Labs content this can be used to remove all the internal content we
 * store at the bottom of a markdown file.
 */
const find = require('unist-util-find');
const remove = require('unist-util-remove');

module.exports = attacher;

function attacher() {
  return transformer;

  function transformer(tree, file) {
    // This is pretty brute force, we find the first node in the tree that
    // represents an <!-- internal --> comment, and then just chop off the
    // rest of the nodes after that.
    const internalComment = {
      type: 'html',
      value: '<!-- internal -->',
    };

    const internalCommentNode = find(tree, internalComment);
    if (internalCommentNode) {
      tree.children.splice(tree.children.indexOf(internalCommentNode));
    }

    // Also remove the <!--lint disable-->, and <!-- vale off --> comments while
    // we're at it.
    const lintNode = find(tree, {
      type: 'html',
      value: '<!--lint disable-->',
    });

    if (lintNode) {
      remove(tree, lintNode);
    }

    const valeNode = find(tree, {
      type: 'html',
      value: '<!-- vale off -->',
    });

    if (valeNode) {
      remove(tree, valeNode);
    }
  }
}
