import { Store, createStore, applyMiddleware } from "redux";
import { appReducer } from "../../iso/reducers/appReducer";
import { State } from "../../iso/state";
import { effectorMiddleware } from "./effector";

const { version } = require("../package.json");
const initialState = () => State.clone(new State(),{ buildVersion: version });

let _store: Store<State>;

export function getStore() {
    return _store ? _store : (_store = createStore(appReducer,initialState(),applyMiddleware(effectorMiddleware)));
}

