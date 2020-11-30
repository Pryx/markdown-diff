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
    const oldStr = 'asdf';
    const newStr = '# Title with newline\nasdf';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '# <ins>Title with newline</ins>\nasdf');
  })
})