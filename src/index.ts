import { Generator } from './generator';

export function markdownDiff(oldStr: string, newStr: string, coloring: boolean = false): string {
  return new Generator().exec(oldStr, newStr, coloring);
}
