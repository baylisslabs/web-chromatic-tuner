import { getStore } from "./store";
import { createDispatchers, Definitions } from "../../iso/actions/app";
import { IAction, ActionDispatcherMap } from "../../iso/actions/defs";

let _dispatcher: ActionDispatcherMap<Definitions>;

export function getDispatcher() {
    return _dispatcher ? _dispatcher : (_dispatcher = createDispatchers((action: IAction<Definitions>)=>{
        const store = getStore();
        store.dispatch(action);
    }));
}