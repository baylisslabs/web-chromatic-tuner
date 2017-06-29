import { Store, createStore } from "redux";
import { appReducer } from "../../iso/reducers/appReducer";
import { State } from "../../iso/state";

let _store: Store<State>;

export function getStore() {
    return _store ? _store : (_store = createStore(appReducer));
}
