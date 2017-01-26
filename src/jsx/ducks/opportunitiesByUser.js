import Opportunities, * as opportunities from "ducks/opportunities"
import {getActions} from "DuckUtil"
import {Map} from "immutable"

let opportunityActions = [
    ...getActions(opportunities)
]

const initialState = Map({})
export default function reducer(state=initialState, action){
    if ( opportunityActions.indexOf(action.type) === -1){
        return state;
    }
    let userId = action.userId
    if ( !userId ){
        return state;
    }
    return state.set(userId, Opportunities(state.get(userId), action))
}
