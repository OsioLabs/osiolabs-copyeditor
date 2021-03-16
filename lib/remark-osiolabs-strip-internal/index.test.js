const remark = require('remark');
const remark_osiolabs_strip_internal = require('./index.js');

const processor = remark()
  .data('settings', { fragment: true })
  .use(remark_osiolabs_strip_internal);

it('Correctly strips everything after the <!-- internal --> tag.', () => {
  const sample = `Before
<!-- internal -->
After`;

  const result = processor.processSync(sample).toString();

  expect(result).toContain(`Before`);
  expect(result).not.toContain(`<!-- internal -->`);
  expect(result).not.toContain(`After`);
});

it('Correctly removes <!--lint disable--> tag.', () => {
  const sample = `test<!--lint disable-->`;

  const result = processor.processSync(sample).toString();
  expect(result).toContain('test');
  expect(result).not.toContain('<!--lint disable-->');
});

it('Correctly removes <!-- vale off --> tag.', () => {
  const sample = `test<!-- vale off -->`;

  const result = processor.processSync(sample).toString();
  expect(result).toContain('test');
  expect(result).not.toContain('<!-- vale off -->');
});
