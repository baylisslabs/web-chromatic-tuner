
require("mithril/test-utils/browserMock")(global);

let m = require("mithril");
let render = require("mithril-node-render");
let { App } = require("./dist/iso/components/app");
let { State } = require("./dist/iso/state");

let state = new State();

const renderAppComponent = () => {
    return render(App(()=>state));
}

exports.renderAppComponent = renderAppComponent;