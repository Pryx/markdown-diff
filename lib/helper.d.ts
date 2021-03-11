import { Change } from 'diff';
export declare class Helper {
    private static titleRegex;
    private static listRegex;
    static isTitle(part: Change): boolean;
    static isList(part: Change): boolean;
    static isTable(part: Change): boolean;
}
