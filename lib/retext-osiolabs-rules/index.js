const fs = require('fs');
const visit = require('unist-util-visit');
const iteratee = require('lodash.iteratee');
const find = require('unist-util-find');

module.exports = attacher;

function findAll(tree, condition) {
  const predicate = iteratee(condition);
  const result = [];

  visit(tree, function (node) {
    if (predicate(node)) {
      result.push(node);
    }
  });

  return result;
}

function attacher() {
  return transformer;

  function transformer(tree, file) {
    // e.g. [# summary #]
    const summaryStart = {
      type: 'linkReference',
      children: [
        {
          value: '# summary #',
        },
      ],
    };

    // e.g. [# endsummary #]
    const summaryEnd = {
      type: 'linkReference',
      children: [
        {
          value: '# endsummary #',
        },
      ],
    };

    if (!find(tree, summaryStart)) {
      file.message(
        'Missing required [# summary #] tag.',
        'osiolabs:required-tags'
      );
    }

    if (!find(tree, summaryEnd)) {
      file.message(
        'Missing required [# endsummary #] tag.',
        'osiolabs:required-tags'
      );
    }

    // Check for tutorial structure, mostly be looking for specific headings
    // that we expect to always be present.
    const requiredHeadings = [
      'Goal',
      'Prerequisites',
      'Recap',
      'Further your understanding',
      'Additional resources',
    ];

    requiredHeadings.forEach((text) => {
      const heading = {
        type: 'heading',
        depth: 2,
        children: [
          {
            value: text,
          },
        ],
      };

      if (!find(tree, heading)) {
        file.message(
          `Missing required "## ${text}" heading.`,
          'osiolabs:required-heading'
        );
      }
    });

    // Verify the structure of a set of steps.
    evalSteps = function (subtree) {
      // e.g. [# summary #]
      const stepsStart = {
        type: 'paragraph',
        children: [
          {
            type: 'linkReference',
            label: '# steps #',
          },
        ],
      };

      // e.g. [# endsteps #]
      const stepsEnd = {
        type: 'paragraph',
        children: [
          {
            type: 'linkReference',
            label: '# endsteps #',
          },
        ],
      };

      const starts = findAll(subtree, stepsStart);
      const ends = findAll(subtree, stepsEnd);

      if (starts.length != ends.length) {
        file.message(
          `You opened, but did not close, a [# steps #] tag.`,
          'osiolabs:unclosed-steps'
        );
      }
    };

    evalSteps(tree);

    // Verify that links to tutorial files and images in this repository are
    // valid.
    //
    // @TODO: figure out why remark-validate-links isn't working for internal
    // links with absolute paths.
    visit(tree, function checkInternalLinks(node) {
      const PWD = process.cwd();
      // We only need to worry repository root baed URLs like:
      // - /tutorials/migrate/overeivew.md
      // - /content/npm/install.md
      // Relative URLs are handled by the remark-validate-links library.
      if (
        (node.type === 'link' || node.type === 'image') &&
        node.url.charAt(0) === '/'
      ) {
        if (!fs.existsSync(`${PWD}${node.url}`)) {
          if (node.type === 'link') {
            file.message(
              `Invalid link to ${node.url}`,
              node,
              'osiolabs:local-link'
            );
          } else {
            file.message(
              `Invalid image path ${node.url}`,
              node,
              'osiolabs:local-image'
            );
          }
        }
      }
    });
  }
}
