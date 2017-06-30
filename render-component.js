
require("mithril/test-utils/browserMock")(global);

let m = require("mithril");
let render = require("mithril-node-render");
let { App } = require("./dist/iso/components/app");
let { State } = require("./dist/iso/state");
const { version } = require("./web/package.json");
const initialState = State.clone(new State(),{ buildVersion: version });

const renderAppComponent = () => {
    return render(App,{state:initialState,dispatch:{}});
}

exports.renderAppComponent = renderAppComponent;