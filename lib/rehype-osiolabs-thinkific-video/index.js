const between = require('unist-util-find-all-between');
const visit = require('unist-util-visit');

module.exports = attacher;

function attacher() {
  return transformer;

  function transformer(tree, file) {
    // See if we can find a <-- thinkific-video-embed --> in the file.
    // This will contain the HTML we copied from Thinkific.
    const start = {
      type: 'comment',
      value: ' thinkific-video-embed ',
    };
    const end = {
      type: 'comment',
      value: ' /thinkific-video-embed ',
    };

    const thinkificVideoEmbedCode = between(tree, start, end);

    if (thinkificVideoEmbedCode.length > 0) {
      visit(
        tree,
        (node) => {
          // This checks for a <p> tag that has text that starts with
          // "[# video #]". Then returns true to indicate we've found a
          // corresponding node in the AST.
          if (
            node.type === 'element' &&
            node.tagName === 'p' &&
            typeof node.children == 'object' &&
            node.children[0].type === 'text' &&
            node.children[0].value.startsWith('[# video #]') > 0
          ) {
            return true;
          }
        },
        (node) => {
          // Replace the [# video #] ... [# endvideo #] with the thinkific
          // embed code we extracted earlier.
          node.tagName = 'div';
          node.properties = { class: ['embedded-video'] };
          node.children = thinkificVideoEmbedCode;
          file.info(
            `Replaced embedded video`,
            node,
            'osiolabs:thinkific-video'
          );
        }
      );
    }
  }
}
