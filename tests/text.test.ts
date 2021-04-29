import { assert } from 'chai';
import { markdownDiff } from '../src/index';

describe('Text', () => {
  it('Single line', () => {
    const oldStr = 'This is a single line';
    const newStr = 'This is a single new line';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, 'This is a single <ins>new </ins>line');
  });
  it('Single line - delete insert', () => {
    const oldStr = 'Simple sentence and delete';
    const newStr = 'Simple sentence with insert and';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, 'Simple sentence <ins>with insert </ins>and<del> delete</del>');
  });

  it('Single line delete insert smart test', () => {
    const oldStr = 'This is a test that tests smarter diffing';
    const newStr = 'This isn\'t not a test that doesn\'t test smarter diffing';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, 'This <del>is </del><ins>isn\'t not </ins>a test that <del>tests </del><ins>doesn\'t test </ins>smarter diffing');
  });


  it('If there is an HTML tag, don\'t fck it up with ins and del', () => {
    const oldStr = 'This is an image <img src="srctest"/>';
    const newStr = 'This is an image <img src="srctest2"/>';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, 'This is an image <del><img src="srctest"/></del><ins><img src="srctest2"/></ins>');
  });

  it('If there is an HTML tag, don\'t fck it up with ins and del', () => {
    const oldStr = `# Title

some content`;

    const newStr = `# Title

some changed cotnent...


asdasdasd

Commit test`;
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, `# Title

some <del>content</del><ins>changed cotnent...</ins>


<ins>asdasdasd</ins>

<ins>Commit test</ins>`);
  });


});
