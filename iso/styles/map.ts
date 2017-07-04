

type StyleSheetMap<T> = {
    [K in keyof T]: string;
}

export function StyleSheetMap<T>(sheet: any, styles: T): StyleSheetMap<T> {
    let result = {} as StyleSheetMap<T>;
    let keys = Object.keys(styles);
    for(const k of keys) {
        const selectorText = sheet.getRule(k).selectorText as string;
        if(/^\./.test(selectorText)) {
            result[k] = selectorText.slice(1);
        }
    }
    return result;
}
