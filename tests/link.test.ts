import { assert } from 'chai';
import { markdownDiff } from '../src/index';

describe('Link', () => {
  it('Link text edit should work correctly', () => {
    const oldStr = "[I'm an inline-style link](https://www.google.com)";
    const newStr = "[Test](https://www.google.com)";
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '<del>[I\'m an inline-style link](https://www.google.com)</del><ins>[Test](https://www.google.com)</ins>');
  })

  it('Link url edit should work correctly', () => {
    const oldStr = "[I'm an inline-style link](https://www.google.com)";
    const newStr = "[I'm an inline-style link](https://www.xxxx.com)";
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '<del>[I\'m an inline-style link](https://www.google.com)</del><ins>[Test](https://www.xxxx.com)</ins>');
  })
})