import { assert } from 'chai';
import { markdownDiff } from '../src/index';
import * as JsDiff from 'diff';


describe('Image tests', () => {
  it('Image should be wrapped around - link', () => {
    const oldStr = '![Img1](zoidberg.jpg)';
    const newStr = '![Img1](zoidberg2.jpg)';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '<del>![Img1](zoidberg.jpg)</del><ins>![Img1](zoidberg2.jpg)</ins>');
  })

  it('Image should be wrapped around - alt', () => {
    const oldStr = '![Img1](zoidberg.jpg)';
    const newStr = '![Img2](zoidberg.jpg)';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '<del>![Img1](zoidberg.jpg)</del><ins>![Img2](zoidberg.jpg)</ins>');
  })
})