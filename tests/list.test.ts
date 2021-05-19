import { assert } from 'chai';
import { markdownDiff } from '../src/index';

describe('List', () => {
  it('List should work correctly', () => {
    const oldStr = '- ele one\n* ele two';
    const newStr = '- ele one\n* ele two\n+ ele three';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '- ele one\n* ele two\n+ <ins>ele three</ins>');
  })
  it('List should work correctly - with numbers', () => {
    const oldStr = '1. ele one\n2. ele two';
    const newStr = '1. ele one\n2. ele two\n3. ele three';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '1. ele one\n2. ele two\n3. <ins>ele three</ins>');
  })
  it('List should work correctly - multiple add', () => {
    const oldStr = '* ele one\n* ele two';
    const newStr = '* ele one\n* ele two\n* ele three\n* ele four';
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, '* ele one\n* ele two\n* <ins>ele three</ins>\n* <ins>ele four</ins>');
  })

  it('List should work after heading', () => {
    const oldStr = `New or updated features.`;
    const newStr = `New or updated features.

# Docu release

## 1.2. - Beginning of November 2020
### Java Spring 
- Simple REST API
- API secured by Keycloak
- new public GIT Repos Link`;
    const diff = markdownDiff(oldStr, newStr);
    assert.equal(diff, `New or updated features.

# <ins>Docu release</ins>

## <ins>1.2. - Beginning of November 2020</ins>
### <ins>Java Spring </ins>
- <ins>Simple REST API</ins>
- <ins>API secured by Keycloak</ins>
- <ins>new public GIT Repos Link</ins>`);
  })

})