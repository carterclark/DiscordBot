const { test, expect } = require(`@jest/globals`);
const textParse = require(`./../../textParse/textParse`);

const hasPrefixArray = [`ICS-111`, `cfs123`, `math 123`];
const classPrefixList = [`ICS`, `CFS`, `MATH`];
// const noPrefix = ``;

test(`true`, () => {
  for (const element of hasPrefixArray) {
    console.log(`element`);
    expect(textParse.hasClassPrefix(element, classPrefixList)).toBe(true);
  }
});
