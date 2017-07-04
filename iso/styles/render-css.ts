import jss, {SheetsRegistry} from "jss"
import preset from "jss-preset-default"
//import * as color from "color"
import {main} from "./main";
import {StyleSheetMap} from "./map";

jss.setup(preset());

export function render() {
    const sheet = jss.createStyleSheet(main);
    const css = sheet.toString();
    return css;
}

export function map() {
    const sheet = jss.createStyleSheet(main);
    const css = sheet.toString();
    const ssm = StyleSheetMap(sheet,main);
    return ssm;
}




