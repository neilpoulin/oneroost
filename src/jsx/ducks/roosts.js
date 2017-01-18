// import { createAction } from "redux-actions";
// import merge from "lodash/merge"
import Parse from "parse"
import Deal from "models/Deal";
import roost, {roostActions} from "./roost"
import { Map } from "immutable";

const initialState = Map({});

const roosts = (state = initialState, action) => {
    if ( roostActions.indexOf(action.type) === -1 )
    {
        return state;
    }
    // debugger;
    let key = action.deal ? action.deal.id || action.deal.objectId : action.dealId
    let {payload} = action;
    if ( payload && payload instanceof Parse.Object ){
        let deal = payload.className === Deal.className ? payload : payload.get("deal");
        if ( deal )
        {
            key = deal.objectId || deal.id
        }
    }

    if (typeof key !== "string" && !action.error) {
        throw new Error("Expected key to be a string.")
    }
    return state.set(key, roost(state.get(key), action))

    // return { ...state,
    //     [key]: roost(state[key], action)
    // }
}
export default roosts;
