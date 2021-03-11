export declare class Generator {
    private static listRegexWithContent;
    private static titleRegexWithContent;
    /**
     * exec
     */
    exec(oldString: string, newString: string, coloring?: boolean): string;
    private titleDiff;
    private listDiff;
    private tableDiff;
}
