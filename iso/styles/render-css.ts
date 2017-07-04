import jss, {SheetsRegistry} from "jss"
import preset from "jss-preset-default"
//import * as color from "color"
import {main} from "./main";
import {StyleSheetMap} from "./map";

jss.setup(preset());

const sheet = jss.createStyleSheet(main);

export function render() {
    const css = sheet.toString();
    return css;
}

export function mapTs() {
    const ssm = StyleSheetMap(sheet,main);
    return `
const classes = ${JSON.stringify(ssm)};
export default classes;
`;
}

//console.log(mapTs());


