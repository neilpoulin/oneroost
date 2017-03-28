import CompanyPage, * as companyPage from "ducks/companyPage"
import {getActions} from "DuckUtil"
import {Map} from "immutable"

let companyPageActions = [
    ...getActions(companyPage)
]

const initialState = Map({})
export default function reducer(state=initialState, action){
    if (companyPageActions.indexOf(action.type) === -1){
        return state;
    }
    let vanityUrl = action.vanityUrl
    if (!vanityUrl){
        return state;
    }
    return state.set(vanityUrl, CompanyPage(state.get(vanityUrl), action))
}
