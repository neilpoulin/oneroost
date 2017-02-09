import {Map} from "immutable"
import {getActions} from "DuckUtil"
import templateReducer, * as templateActions from "ducks/templates"

let actions = [
    ...getActions(templateActions)
]

const initialState = Map({});

export default function reducer(state=initialState, action){
    let userId = action.userId
    if ( !userId || actions.indexOf(action.type) === -1){
        return state;
    }

    state = state.set(userId, templateReducer(state.get(userId), action))

    return state;
}
