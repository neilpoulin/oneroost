import * as Stakeholder from "models/Stakeholder"
import * as Deal from "models/Deal"
import {normalize} from "normalizr"
import Parse from "parse"
import {Map, List} from "immutable"

export const ADD_STAKEHOLDER = "oneroost/ADD_STAKEHOLDER"
export const STAKEHOLDER_LOAD_REQUEST = "oneroost/STAKEHOLDER_LOAD_REQUEST"
export const STAKEHOLDER_LOAD_SUCCESS = "oneroost/STAKEHOLDER_LOAD_SUCCESS"
export const STAKEHOLDER_LOAD_ERROR = "oneroost/STAKEHOLDER_LOAD_ERROR"

export const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    ids: List([]),
})

export default function reducer(state=initialState, action){
    switch (action.type) {
        case STAKEHOLDER_LOAD_REQUEST:
            state = state.set("isLoading", true)
            break;
        case STAKEHOLDER_LOAD_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("hasLoaded", true)
            state = state.set("ids", List(action.payload.map(stakeholder => stakeholder.objectId)))
            break;
        case STAKEHOLDER_LOAD_ERROR:
            state = state.set("isLoading", false);
            break;
        default:
            break;
    }
    return state;
}

export const loadStakeholders = (dealId, force=false) => (dispatch, getState) => {
    let {roosts} = getState();
    if ( roosts.has(dealId) && roosts.get(dealId).get("stakeholders").get("hasLoaded") && !roosts.get(dealId).get("stakeholders").get("isLoading") && !force ){
        console.warn("not loading stakeholders as it has been loaded before")
        return null
    }
    dispatch({
        type: STAKEHOLDER_LOAD_REQUEST,
        dealId: dealId
    });
    var stakeholderQuery = new Parse.Query("Stakeholder");
    stakeholderQuery.equalTo("deal", Deal.Pointer(dealId));
    stakeholderQuery.include("user");
    stakeholderQuery.find().then(stakeholders => {
        let json = stakeholders.map(stakeholder => stakeholder.toJSON())
        let entities = normalize(json, [Stakeholder.Schema]).entities || {}
        dispatch({
            type: STAKEHOLDER_LOAD_SUCCESS,
            dealId: dealId,
            payload: json,
            entities: Map(entities)
        })
    }).catch(error => {
        console.error(error)
        dispatch({
            type: STAKEHOLDER_LOAD_ERROR,
            error: {
                error: error,
                message: "Failed to load stakeholders",
                level: "ERROR"
            }
        })
    });

}
