import { assert } from 'chai';
import { markdownDiff } from '../src/index';

describe('Image tests', () => {
  it('Image should be wrapped around', () => {
    const oldStr = '<img src="test"/>';
    const newStr = '<img src="test2"/>';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '<del><img src="test"/></del><ins><img src="test2"/></ins>');
  })

  it('Image should be wrapped around even if multiple changes', () => {
    const oldStr = '<img class="abc" src="test"/>';
    const newStr = '<img class="bcd" src="test2"/>';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '<del><img class="abc" src="test"/></del><ins><img class="bcd" src="test2"/></ins>');
  })
})