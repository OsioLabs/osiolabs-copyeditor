const rehype = require('rehype');
const rehype_osiolabs_steps = require('./index.js');

const processor = rehype()
  .data('settings', { fragment: true })
  .use(rehype_osiolabs_steps);

it('Correctly formats [# step #] tags.', () => {
  const sample = `<p>[# steps #]</p>
<h3>Step one</h3>
<p>Content</p>
<p>[# ----- #]</p>
<h3>Step two</h3>
<p>Content two</p>
<p>[# endsteps #]</p>`;

  const after = `<div class="tutorial-steps"><div class="tutorial-steps--step">
<h3>Step one</h3>
<p>Content</p>
</div><div class="tutorial-steps--step">
<h3>Step two</h3>
<p>Content two</p>
</div></div>`;

  const result = processor.processSync(sample).toString();

  expect(result).toEqual(after);
});
