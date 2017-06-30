import * as m from "mithril";
import { Store } from "redux";
import { getStore } from "./store";
import { getDispatcher } from "./dispatcher";
import { State } from "../../iso/state";
import { App } from "../../iso/components/app";
import { actions } from "../../iso/actions/app";

const store = getStore();
const dispatch = getDispatcher();

renderApp();

store.subscribe(()=> {
    if(process.env.NODE_ENV==="development") {
        console.log(JSON.stringify(store.getState()));
    };
    requestAnimationFrame(renderApp);
});


function renderApp() {
    m.render(document.getElementById("app"),m(App(store.getState(),dispatch)));
}
