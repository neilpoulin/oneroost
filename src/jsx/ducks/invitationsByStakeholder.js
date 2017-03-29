import {Map} from "immutable"
import {getActions} from "ducks/DuckUtil"
import invitationReducer, * as invitationActions from "ducks/invitation"

let actions = [
    ...getActions(invitationActions)
]
export const initialState = Map({})

export default function reducer(state=initialState, action){
    let stakeholderId = action.stakeholderId
    if (!stakeholderId && actions.indexOf(action.type) === -1){
        return state
    }
    state = state.set(stakeholderId, invitationReducer(state.get(stakeholderId), action))

    return state;
}
