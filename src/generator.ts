import * as JsDiff from 'diff';
import { Helper } from './helper';

export class Generator {
  private static listRegexWithContent = /^([\r\n\t ]*)(\*|-|\+|\d+\.)([ ]*)(.*)$/gm;
  private static titleRegexWithContent = /^([\r\n\t ]*)(#+)([ ]*)(.*)$/gm;
  private static delColoring = ' style="color:#a33;background:#ffeaea;text-decoration:line-through;"';
  private static addColoring = ' style="color:darkgreen;background:#eaffea;"';
  private delStyles = '';
  private addStyles = '';

  /**
   * exec
   */
  public exec(oldString: string, newString: string, coloring:boolean = false) {
    this.delStyles = coloring ? Generator.delColoring : '';
    this.addStyles = coloring ? Generator.addColoring : '';
    const output: string[] = [];
    const parts = JsDiff.diffWordsWithSpace(oldString, newString);

    for (let i = 0; i < parts.length; i++) {
      const value = parts[i].value;
      
      const prefix = parts[i].added ? `<ins${this.addStyles}>` : parts[i].removed ? `<del${this.delStyles}>` : '';
      const posfix = parts[i].added ? '</ins>' : parts[i].removed ? '</del>' : '';


      if (Helper.isTitle(parts[i])) {
        output.push(this.titleDiff(value, prefix, posfix));
      } else if (Helper.isTable(parts[i])) {
        output.push(this.tableDiff(value, prefix, posfix));
      } else if (Helper.isList(parts[i])) {
        output.push(this.listDiff(value, prefix, posfix));
      } else if (parts[i].removed || parts[i].added) {
        let added: string = "";
        let removed: string = "";
        for (; i < parts.length; i++){
          if (Helper.isTitle(parts[i]) ||
            Helper.isTable(parts[i]) ||
            Helper.isList(parts[i])){
            i--;
            break;
          }

          if (parts[i].value.trim().length == 0){
            added += parts[i].value;
            removed += parts[i].value;
          } else if (parts[i].added) {
            added += parts[i].value;
          } else if (parts[i].removed){
            removed += parts[i].value;
          }else{
            i--;
            break;
          }
        }

        if (removed.length){
            output.push(`<del${this.delStyles}>${removed}</del>`);
        }
    
        if (added.length){
            output.push(`<ins${this.addStyles}>${added}</ins>`);
        }
      }else{
        output.push(parts[i].value);
      }
    }

    let regexImgFix = /(<(img|br).*\/>)/gm;

    let out = output.join('');

    let found = [...out.matchAll(regexImgFix)];
    
    for (const elem of found.map(m => m[1])){
      if (elem.includes('del') || elem.includes('ins')){
        let original = elem.replace(/<del.*?>(.*?)<\/del>/g, '$1').replace(/<ins.*?\/ins>/g, '');
        let modified = elem.replace(/<ins.*?>(.*?)<\/ins>/g, '$1').replace(/<del.*?\/del>/g, '');

        out = out.replace(elem, `<del${this.delStyles}>${original}</del><ins${this.addStyles}>${modified}</ins>`);
      }
    }

    return out;
  }

  
  private titleDiff(value: string, prefix: string, posfix: string) {
    const out = [];
    let match = Generator.titleRegexWithContent.exec(value);
    while (match !== null) {
      const spaces = match[1];
      const listOp = match[2];
      const afterOpSpaces = match[3];
      const content = match[4];

      out.push(`${spaces}${listOp}${afterOpSpaces}${prefix}${content}${posfix}`);
      match = Generator.titleRegexWithContent.exec(value);
    }

    if(value.endsWith("\n")){
      return out.join('\n') + '\n';
    }else{
      return out.join('\n');
    }
  }

  private listDiff(value: string, prefix: string, posfix: string) {
    const out = [];
    let match = Generator.listRegexWithContent.exec(value);
    while (match !== null) {
      const spaces = match[1];
      const listOp = match[2];
      const afterOpSpaces = match[3];
      const content = match[4];

      out.push(`${spaces}${listOp}${afterOpSpaces}${prefix}${content}${posfix}`);
      match = Generator.listRegexWithContent.exec(value);
    }

    return out.join('\n');
  }

  private tableDiff(value: string, prefix: string, posfix: string): string {
    const out: string[] = [];

    const split = value.split('|');

    const startWithPipe = split[0].length === 0 ? '|' : '';
    const endsWithPipe = split[split.length - 1].length === 0 ? '|' : '';

    const filtered = split.filter(el => el.length !== 0);
    for (const val of filtered) {
      out.push(`${prefix}${val}${posfix}`);
    }

    return startWithPipe + out.join('|') + endsWithPipe;
  }
}
