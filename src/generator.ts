import * as JsDiff from 'diff';
import { Helper } from './helper';

export class Generator {
  private static listRegexWithContent = /^([\r\n\t ]*)(\*|-|\+|\d+\.)([ ]*)(.*)$/gm;
  private static titleRegexWithContent = /^([\r\n\t ]*)(#+)([ ]*)(.*)$/gm;

  /**
   * exec
   */
  public exec(oldString: string, newString: string, coloring:boolean = false) {
    const output: string[] = [];
    const parts = JsDiff.diffWordsWithSpace(oldString, newString);

    for (let i = 0; i < parts.length; i++) {
      const value = parts[i].value;
      
      const prefix = parts[i].added ? `<ins>` : parts[i].removed ? `<del>` : '';
      const posfix = parts[i].added ? '</ins>' : parts[i].removed ? '</del>' : '';


      if (Helper.isTitle(parts[i])) {
        //If title, diff it with titleDiff and push to output
        output.push(this.titleDiff(value, prefix, posfix));
      } else if (Helper.isTable(parts[i])) {
        //If table, diff it with tableDiff and push to output
        output.push(this.tableDiff(value, prefix, posfix));
      } else if (Helper.isList(parts[i])) {
        //If list, diff it with listDiff and push to output
        output.push(this.listDiff(value, prefix, posfix));
      } else if (parts[i].removed || parts[i].added) {
        //If normal text, check if we can combine it
        let added: string = "";
        let removed: string = "";
        //Iterate over parts
        for (; i < parts.length; i++){
          //We found special item! Backtrack and break the cycle
          if (Helper.isTitle(parts[i]) ||
            Helper.isTable(parts[i]) ||
            Helper.isList(parts[i])){
            i--;
            break;
          }

          if (parts[i].value.trim().length == 0){
            //If whitespace, just add it to both, we don't care. Works well enough
            added += parts[i].value;
            removed += parts[i].value;
          } else if (parts[i].added) {
            //If added, just add it to added
            added += parts[i].value;
          } else if (parts[i].removed){
            //Ditto but for removed :)
            removed += parts[i].value;
          }else{
            // We found something that is not added, removed or whitespace. Let's break this cycle
            i--;
            break;
          }
        }

        if (removed.length){
            output.push(`<del>${removed}</del>`);
        }
    
        if (added.length){
            output.push(`<ins>${added}</ins>`);
        }
      }else{
        output.push(parts[i].value);
      }
    }

    let regexImgFix = /(<(img|br).*\/>)/gm;

    let linksFix = /(\[.*?\]\(.*?\))/gm;

    let out = output.join('');

    let links = [...out.matchAll(linksFix)];
    let imgbr = [...out.matchAll(regexImgFix)];
    let found = imgbr.concat(links);
    
    for (const elem of found.map(m => m[1])){
      if (elem.includes('<del') || elem.includes('<ins')){
        let original = elem.replace(/<del.*?>(.*?)<\/del>/g, '$1').replace(/<ins.*?\/ins>/g, '');
        let modified = elem.replace(/<ins.*?>(.*?)<\/ins>/g, '$1').replace(/<del.*?\/del>/g, '');

        out = out.replace(elem, `<del>${original}</del><ins>${modified}</ins>`);
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
