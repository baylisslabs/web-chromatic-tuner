

type StyleSheetMap<T> = {
    [K in keyof T]: string;
}

export function StyleSheetMap<T>(sheet: any, styles: T): StyleSheetMap<T> {
    let result = {} as StyleSheetMap<T>;
    let keys = Object.keys(styles);
    for(const k of keys) {
        let selector = 
        result[k] = sheet.getRule(k).selectorText;
    }
    return result;
}
