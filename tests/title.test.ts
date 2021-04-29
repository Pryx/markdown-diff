import { assert } from 'chai';
import { markdownDiff } from '../src/index';

describe('Title', () => {
  it('with single #', () => {
    const oldStr = '# ele one\n# ele two';
    const newStr = '# ele one\n# ele two\n# ele three';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '# ele one\n# ele two\n# <ins>ele three</ins>');
  })
  it('With multilple ##', () => {
    const oldStr = '## ele one\n## ele two';
    const newStr = '## ele one\n## ele two\n## ele three\n## ele four';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '## ele one\n## ele two\n## <ins>ele three</ins>\n## <ins>ele four</ins>');
  })

  it('Added title', () => {
    const oldStr = '';
    const newStr = '#Title';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '#<ins>Title</ins>');
  })

  it('Added title', () => {
    const oldStr = 'test';
    const newStr = '# Title with newline\ntest';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '# <ins>Title with newline</ins>\ntest');
  })

  it('Changed title', () => {
    const oldStr = '# test\ntest';
    const newStr = '# test2\ntest';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '# <del>test</del>\n# <ins>test2</ins>\ntest');
  })  
  
  it('Changed title to text', () => {
    const oldStr = '# test';
    const newStr = 'test2';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '# <del>test</del>\n<ins>test2</ins>');
  })  
})