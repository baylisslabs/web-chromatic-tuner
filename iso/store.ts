import { Store, createStore } from "redux";
import { appReducer } from "./reducers/appReducer";
import { State } from "./state";

let _store: Store<State>;

export function getStore() {
    return _store ? _store : (_store = createStore(appReducer));
}
