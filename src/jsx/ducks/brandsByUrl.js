import Brand, * as brand from "ducks/brand"
import {getActions} from "DuckUtil"
import {Map} from "immutable"

let brandActions = [
    ...getActions(brand)
]

const initialState = Map({})
export default function reducer(state=initialState, action){
    if (brandActions.indexOf(action.type) === -1){
        return state;
    }

    let vanityUrl = action.vanityUrl
    if (!vanityUrl){
        return state;
    }
    return state.set(vanityUrl, Brand(state.get(vanityUrl), action))
}
