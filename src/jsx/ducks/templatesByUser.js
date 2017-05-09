import {Map} from "immutable"
import {getActions} from "DuckUtil"
import userTemplateReducer, * as userTemplateActions from "ducks/userTemplates"

let actions = [
    ...getActions(userTemplateActions)
]

const initialState = Map({});

export default function reducer(state=initialState, action){
    let userId = action.userId
    if (!userId || actions.indexOf(action.type) === -1){
        return state;
    }

    state = state.set(userId, userTemplateReducer(state.get(userId), action))

    return state;
}
