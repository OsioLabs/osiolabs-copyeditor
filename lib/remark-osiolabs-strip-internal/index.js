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
    //
    // We used to use a <!--lint disable --> control comment along with the
    // <!-- internal --> comments in tutorials to indicate that "everything from
    // here to the end of the file" can be ignored. But, unified-message-control
    // doesn't really work that way. And this has unintended consequences where
    // linting errors can get surpressed if they are async (e.g. checking links)
    // and haven't been completed by the time the <!--lint disable--> comment is
    // reached.
    //
    // So this removes those comments from the tree so we don't end up hiding
    // any valid errors. And warns about removing it from the file.
    //
    // In theory these will all eventually get removed from the repo, and we can
    // remove this bit of code.
    const lintNode = find(tree, (node) => {
      if (node.type === 'html' && node.value.indexOf('lint disable') > -1) {
        return true;
      }
    });

    if (lintNode) {
      file.message(
        `Remove deprecated "<!--lint disable-->" comments`,
        lintNode,
        'osiolabs:remove-lint-comments'
      );
      remove(tree, lintNode);
    }

    const valeNode = find(tree, {
      type: 'html',
      value: '<!-- vale off -->',
    });

    if (valeNode) {
      remove(tree, valeNode);
    }

    // Add a single blank line to replace all the nodes we removed.
    tree.children.push({type: 'text', value: ''});
  }
}
