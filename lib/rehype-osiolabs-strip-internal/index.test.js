const rehype = require('rehype');
const rehype_osiolabs_strip_internal = require('./index.js');

const processor = rehype()
  .data('settings', { fragment: true })
  .use(rehype_osiolabs_strip_internal);

it('Correctly strips everything after the <!-- internal --> tag.', () => {
  const sample = `<p>Before</p>
<!-- internal -->
<p>After</p>`;

  const result = processor.processSync(sample).toString();

  expect(result).toContain(`<p>Before</p>`);
  expect(result).not.toContain(`!<-- internal -->`);
  expect(result).not.toContain(`<p>After</p>`);
});

it('Correctly removes <!-- vale off --> tag.', () => {
  const sample = `<p>test</p><!-- vale off -->`;

  const result = processor.processSync(sample).toString();
  expect(result).toEqual('<p>test</p>');
});
