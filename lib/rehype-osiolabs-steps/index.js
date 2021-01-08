/**
 * @file
 *
 * Parse [# steps #] ... [# endsteps #] into HTML.
 *
 * Transforms something like the following: (note, this is what you'll get after
 * running a tutorial .md file with our custom [# steps #] tags through remark).
 *
 * <p>[# steps #]</p>
 * <h3>Step heading one</h3>
 * <p>Step one content</p>
 * <p>[# -------------------- #]</p>
 * <h3>Step heading two</h3>
 * <p>Step two content</p>
 * <p>[# endsteps #]</p>
 *
 * To HTML like the following:
 *
 * <div class="tutorial-steps">
 *   <div class="tutorial-steps--step">
 *    <h3>Step heading one</h3>
 *    <p>Step one content</p>
 *  </div>
 *  <div class="tutorial-steps--step">
 *    <h3>Step heading two</h3>
 *    <p>Step twp content</p>
 *  </div>
 * </div>
 */

const visit = require('unist-util-visit');
const is = require('unist-util-is');
const find = require('unist-util-find');
const cloneDeep = require('lodash/cloneDeep');

module.exports = attacher;

function attacher() {
  return transformer;

  function transformer(tree, file) {
    // A start tag looks like <p>[# steps #]</p>.
    const isStepsStartNode = function (node) {
      if (
        node.type == 'element' &&
        node.tagName == 'p' &&
        node.children &&
        typeof node.children == 'object' &&
        node.children[0].type === 'text' &&
        node.children[0].value === '[# steps #]'
      ) {
        return true;
      }
    };

    // An end tag looks like <p>[# endsteps #]</p>.
    const isStepsEndNode = function (node) {
      if (
        node.type == 'element' &&
        node.tagName == 'p' &&
        node.children &&
        typeof node.children == 'object' &&
        node.children[0].type === 'text' &&
        node.children[0].value === '[# endsteps #]'
      ) {
        return true;
      }
    };

    // A divider looks like <p>[# ------------ #]</p>.
    const isStepDividerNode = function (node) {
      if (
        node.type == 'element' &&
        node.tagName == 'p' &&
        node.children &&
        typeof node.children == 'object' &&
        node.children[0].type === 'text' &&
        node.children[0].value.match(/^\[#\s?-{3,}\s?#\]$/)
      ) {
        return true;
      }
    };

    const transformStepSet = function (ast) {
      const steps = {
        type: 'element',
        tagName: 'div',
        properties: { class: ['tutorial-steps'] },
        children: [],
      };

      const stepNode = {
        type: 'element',
        tagName: 'div',
        properties: { class: ['tutorial-steps--step'] },
        children: [],
      };

      const start = find(ast, isStepsStartNode);
      const startIdx = ast.children.indexOf(start);

      const end = find(ast, isStepsEndNode);
      const endIdx = ast.children.indexOf(end);

      // Loop over the children between startIdx and endIdx and split them into
      // groups by finding the step divider nodes.
      let index = startIdx;
      let stepCount = 0;
      steps.children.push(cloneDeep(stepNode));
      while (++index < endIdx) {
        const child = ast.children[index];

        if (is(child, isStepDividerNode)) {
          steps.children.push(cloneDeep(stepNode));
          stepCount++;
        } else {
          steps.children[stepCount].children.push(child);
        }
      }

      // Replace the section of the tree that contains the steps, and the start
      // end steps tags, with the new tree.
      ast.children.splice(startIdx, endIdx - startIdx + 1, steps);

      // If there's another set of steps, call this function again and parse
      // that set.
      const next = find(ast, isStepsStartNode);
      if (is(next, 'element')) {
        transformStepSet(ast);
      }
    };

    transformStepSet(tree);
  }
}
