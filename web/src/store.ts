import { Store, createStore, applyMiddleware } from "redux";
import { rootReducer } from "../../iso/reducers/rootReducer";
import { State } from "../../iso/state";
//import thunk from "redux-thunk";

let _store: Store<State>;

export function getStore() {
    return _store ? _store : (_store = createStore(rootReducer/*, applyMiddleware(thunk)*/));
}
