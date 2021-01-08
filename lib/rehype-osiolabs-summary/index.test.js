const rehype = require('rehype');
const rehype_osiolabs_summary = require('./index.js');

const processor = rehype()
  .data('settings', { fragment: true })
  .use(rehype_osiolabs_summary);

it('Correctly formats [# summary #] tags.', () => {
  const sample = `<p>[# summary #]</p>
<p>Summary content</p>
<p>[# endsummary #]</p>`;

  const result = processor.processSync(sample).toString();
  expect(result).toEqual(
    `<div class="tutorial-summary"><p>Summary content</p></div>`
  );
});
