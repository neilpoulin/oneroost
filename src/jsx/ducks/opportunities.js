import Parse from "parse"
import * as User from "models/User"
import * as Deal from "models/Deal"
import {normalize} from "normalizr"

export const OPPORTUNITY_LOAD_REQUEST = "OPPORTUNITY_LOAD_REQUEST"
export const OPPORTUNITY_LOAD_SUCCESS = "OPPORTUNITY_LOAD_SUCCESS"
export const OPPORTUNITY_LOAD_ERROR = "OPPORTUNITY_LOAD_ERROR"

const initialState = {
    isLoading: false,
    deals: [],
    archivedDeals: []
}
export default function reducer(state=initialState, action){
    switch (action.type) {
        case OPPORTUNITY_LOAD_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case OPPORTUNITY_LOAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                deals: action.payload.deals.map(deal => deal.objectId|| deal.id),
                archivedDeals: action.payload.archivedDeals.map(deal => deal.objectId || deal.id)
            }
        case OPPORTUNITY_LOAD_ERROR:
            return {
                ...state,
                isLoading: false
            }
        default:
            return state;
    }
}


export const loadOpportunities = (userId) => (dispatch) => {
    dispatch({
        type: OPPORTUNITY_LOAD_REQUEST,
        userId: userId,
    })

    var opportunitiesQuery = new Parse.Query("Stakeholder");
    opportunitiesQuery.include("deal");
    opportunitiesQuery.include(["deal.account"]);
    opportunitiesQuery.include("deal.createdBy");
    opportunitiesQuery.include("deal.readyRoostUser");
    opportunitiesQuery.equalTo("user", User.Pointer(userId) );
    opportunitiesQuery.equalTo("inviteAccepted", true);
    opportunitiesQuery.find().then(stakeholders => {
        let active = stakeholders.filter( obj => obj.get("active") !== false );
        let archived = stakeholders.filter( obj => obj.get("active") === false );

        let deals = active.map(stakeholder => stakeholder.get("deal").toJSON());
        let archivedDeals = archived.map(stakeholder => stakeholder.get("deal").toJSON());

        let allDeals = [...deals, ...archivedDeals]
        let normalized = normalize(allDeals, [Deal.Schema]);
        dispatch({
            type: OPPORTUNITY_LOAD_SUCCESS,
            userId: userId,
            entities: normalized.entities || {},
            payload: {
                deals,
                archivedDeals
            }
        })
    }).catch(error => {
        console.error(error);
        dispatch({
            type: OPPORTUNITY_LOAD_ERROR,
            userId: userId,
            error: {
                message: "Failed to fetch opportunities",
                level: "ERROR",
                error: error
            }
        })
    })
}
