import * as Stakeholder from "models/Stakeholder"
import * as Deal from "models/Deal"
import {normalize} from "normalizr"
import Parse from "parse"

export const ADD_STAKEHOLDER = "ADD_STAKEHOLDER"
export const STAKEHOLDER_LOAD_REQUEST = "STAKEHOLDER_LOAD_REQUEST"
export const STAKEHOLDER_LOAD_SUCCESS = "STAKEHOLDER_LOAD_SUCCESS"
export const STAKEHOLDER_LOAD_ERROR = "STAKEHOLDER_LOAD_ERROR"

const initialState = {
    isLoading: false,
    ids: [],
}

export default function reducer(state=initialState, action){
    switch (action.type) {
        case STAKEHOLDER_LOAD_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case STAKEHOLDER_LOAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                ids: action.payload.map(stakeholder => stakeholder.objectId)
            }
        case STAKEHOLDER_LOAD_ERROR:
            return{
                ...state,
                isLoading: false,
            }
        default:
            return state;
    }
}

export const loadStakeholders = (dealId) => (dispatch) => {
    dispatch({
        type: STAKEHOLDER_LOAD_REQUEST,
        dealId: dealId
    });
    var stakeholderQuery = new Parse.Query("Stakeholder");
    stakeholderQuery.equalTo("deal", Deal.Pointer(dealId));
    stakeholderQuery.include("user");
    stakeholderQuery.find().then(stakeholders => {
        let json = stakeholders.map(stakeholder => stakeholder.toJSON())
        let normalized = normalize(json, [Stakeholder.Schema])
        dispatch({
            type: STAKEHOLDER_LOAD_SUCCESS,
            dealId: dealId,
            payload: json,
            entities: normalized.entities || {}
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
