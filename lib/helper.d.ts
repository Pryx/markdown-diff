import { Change } from 'diff';
export declare class Helper {
    static titleRegex: RegExp;
    static listRegex: RegExp;
    static isTitle(part: Change): boolean;
    static isList(part: Change): boolean;
    static isTable(part: Change): boolean;
}
