import * as opportunities from "ducks/opportunities"
import {getActions} from "DuckUtil"

let opportunityActoins = [
    ...getActions(opportunities)
]

const initialState={}
export default function reducer(state=initialState, action){
    if ( opportunityActoins.indexOf(action.type) === -1){
        return state;
    }
    let userId = action.userId
    if ( !userId ){
        return state;
    }
    return { ...state,
        [userId]: opportunities.default(state[userId], action)
    }
}
