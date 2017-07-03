import jss, {SheetsRegistry} from "jss"
import preset from "jss-preset-default"
//import * as color from "color"
import {main} from "./main";
import {StyleSheetMap} from "./map";

jss.setup(preset())

export function render() {
    const sheet = jss.createStyleSheet(main)
    const css = sheet.toString() // Returns CSS of all attached Style Sheets together.
    console.log(css);
    const s = StyleSheetMap(sheet,main);
    console.log(s);

    return css;
}
render();



