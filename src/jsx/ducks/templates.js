import {Map} from "immutable"
import {getActions} from "DuckUtil"
import templateReducer, * as templateActions from "ducks/template"

let actions = [
    ...getActions(templateActions)
]

const initialState = Map({});

export default function reducer(state=initialState, action){
    let templateId = action.templateId
    if (!templateId || actions.indexOf(action.type) === -1){
        return state;
    }

    state = state.set(templateId, templateReducer(state.get(templateId), action))

    return state;
}
