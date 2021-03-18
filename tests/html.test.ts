import { assert } from 'chai';
import { markdownDiff } from '../src/index';
import * as JsDiff from 'diff';


describe('HTML tests', () => {
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


  it('Image should be wrapped around even if preceding text changed', () => {
    const oldStr = 'Test <img class="abc" src="test"/>';
    const newStr = 'Test2 <img class="bcd" src="test2"/>';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '<del>Test</del><ins>Test2</ins> <del><img class="abc" src="test"/></del><ins><img class="bcd" src="test2"/></ins>');
  })

  it('If same, do not duplicate', () => {
    const oldStr = '<img alt="overview_option" src={useBaseUrl(\'xxx\')} />';
    const newStr = '<img alt="overview_option" src={useBaseUrl(\'xxx\')} />';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '<img alt="overview_option" src={useBaseUrl(\'xxx\')} />');
  })

  it('If added, do not duplicate', () => {
    const oldStr = '';
    const newStr = '<img class="abc" src="test"/>';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '<ins><img class="abc" src="test"/></ins>');
  })

  it('If removed, do not duplicate', () => {
    const oldStr = '<img class="abc" src="test"/>';
    const newStr = '';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '<del><img class="abc" src="test"/></del>');
  })

  it('Newlines', () => {
    const oldStr = "Added stuff...\n";
    const newStr = "Added stuff. Test\nasdasd\ntest\n";
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, "Added stuff<del>...</del><ins>. Test</ins>\n<ins>asdasd</ins>\n<ins>test</ins>\n");
  })

  it('If removed, do not duplicate', () => {
    const oldStr = '<br> <br> <br>';
    const newStr = '<br>';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '<br><del> <br> <br></del>');
  })
})