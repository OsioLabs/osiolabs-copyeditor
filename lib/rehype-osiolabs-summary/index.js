/**
 * @file
 *
 * Wrap everything between a [# summary #] ... [# endsummary] in a <div> and
 * then remove the custom tokens.
 *
 * This assumes the tutorial .md file has already been run through remark.
 *
 * Takes output like this:
 *
 * <p>[# summary #]</p>
 * <p>Summary content here ...</p>
 * <p>[# endsummary #]</p>
 *
 * And turns it into:
 *
 * <div class="tutorial-summary">
 *    <p>Summary content here ...</p>
 * </div>
 */

const visit = require('unist-util-visit');
const is = require('unist-util-is');

module.exports = attacher;

function attacher() {
  return transformer;

  function transformer(tree, file) {
    const isSummaryStartNode = function (node) {
      if (
        node.type == 'element' &&
        node.tagName == 'p' &&
        node.children &&
        typeof node.children == 'object' &&
        node.children[0].type === 'text' &&
        node.children[0].value === '[# summary #]'
      ) {
        return true;
      }
    };
    const isSummaryEndNode = function (node) {
      if (
        node.type == 'element' &&
        node.tagName == 'p' &&
        node.children &&
        typeof node.children == 'object' &&
        node.children[0].type === 'text' &&
        node.children[0].value === '[# endsummary #]'
      ) {
        return true;
      }
    };

    let startIdx = (endIdx = false);
    const summaryChildren = [];

    // Find the start/end tokens and everything between them.
    visit(tree, 'element', (node, index, parent) => {
      if (is(node, isSummaryEndNode)) {
        endIdx = index;
      }

      // If we know the start, but not the end, that means we're dealing with
      // a node that's in-between the opening and closing summary tags.
      if (startIdx !== false && endIdx === false) {
        summaryChildren.push(node);
      }

      if (is(node, isSummaryStartNode)) {
        startIdx = index;
      }
    });

    // Update the AST tree to nest the children in a div and remove the custom
    // tokens.
    if (startIdx !== false && endIdx !== false && summaryChildren.length > 0) {
      const newNode = {
        type: 'element',
        tagName: 'div',
        properties: { class: ['tutorial-summary'] },
        children: summaryChildren,
      };
      tree.children.splice(startIdx, endIdx - startIdx + 1, newNode);
    }
  }
}
