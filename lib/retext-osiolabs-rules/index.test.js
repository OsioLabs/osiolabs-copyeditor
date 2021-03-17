const remark = require('remark');
const remark_osiolabs_rules = require('./index.js');

const processor = remark()
  .data('settings', { fragment: true })
  .use(remark_osiolabs_rules);


/**
 * Helper to check if a file contains a given error.
 *
 * @param {VFile} file 
 * @param {string} error 
 * @returns bool
 */
const hasError = function(file, error) {
  if (file.messages.length > 0) {
    return file.messages.find((element) => {
      return element.message === error;
    });
  }

  return false;
}

it (`Finds missing summary tag`, () => {
  const sample = `Hello world`;

  const file = processor.processSync(sample);
  const err = hasError(file, 'Missing required [# summary #] tag.');
  expect(err).toBeTruthy();
});

it (`Finds missing endsummary tag`, () => {
  const sample = `Hello world`;

  const file = processor.processSync(sample);
  const err = hasError(file, 'Missing required [# endsummary #] tag.');
  expect(err).toBeTruthy();
});

it (`Finds summary tag in a paragraph of it's own`, () => {
  const sampleSummaryBySelf =
  `Before
  
[# summary #]

After`;

  const file = processor.processSync(sampleSummaryBySelf);
  const err = hasError(file, 'Missing required [# summary #] tag.');
  expect(err).toBeFalsy();
});

it (`Finds summary tag in a paragraph with other text`, () => {
  const sampleSummaryGrouped =
  `Before
  
[# summary #]
After`;

  const file = processor.processSync(sampleSummaryGrouped);
  const err = hasError(file, 'Missing required [# summary #] tag.');
  expect(err).toBeFalsy();
});

it (`Finds endsummary tag in a paragraph of it's own`, () => {
  const sampleSummaryBySelf =
  `Before
  
[# endsummary #]

After`;

  const file = processor.processSync(sampleSummaryBySelf);
  const err = hasError(file, 'Missing required [# endsummary #] tag.');
  expect(err).toBeFalsy();
});

it (`Finds endsummary tag in a paragraph with other text`, () => {
  const sampleSummaryGrouped =
  `Before
[# endsummary #]

After`;

  const file = processor.processSync(sampleSummaryGrouped);
  const err = hasError(file, 'Missing required [# endsummary #] tag.');
  expect(err).toBeFalsy();
});
