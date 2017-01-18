import Parse from "parse"
import * as User from "models/User"
import * as Deal from "models/Deal"
import {normalize} from "normalizr"
import {Map, List} from "immutable"

export const OPPORTUNITY_LOAD_REQUEST = "OPPORTUNITY_LOAD_REQUEST"
export const OPPORTUNITY_LOAD_SUCCESS = "OPPORTUNITY_LOAD_SUCCESS"
export const OPPORTUNITY_LOAD_ERROR = "OPPORTUNITY_LOAD_ERROR"

const initialState = Map({
    isLoading: false,
    deals: List([]),
    archivedDeals: List([])
})
export default function reducer(state=initialState, action){
    switch (action.type) {
        case OPPORTUNITY_LOAD_REQUEST:
            state = state.set("isLoading", true);
            break;
        case OPPORTUNITY_LOAD_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("deals", List(action.payload.get("deals").map(deal => deal.get("objectId")|| deal.id)))
            state = state.set("archivedDeals", List(action.payload.get("archivedDeals").map(deal => deal.get("objectId") || deal.id)))
            break;
        case OPPORTUNITY_LOAD_ERROR:
            state = state.set("isLoading", true);
            break;
        default:
            break;
    }
    return state;
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

        let deals = List(active.map(stakeholder => Map(stakeholder.get("deal").toJSON())));
        let archivedDeals = List(archived.map(stakeholder => Map(stakeholder.get("deal").toJSON())));

        let allDeals = deals.concat(archivedDeals);
        let entities = normalize(allDeals.toJS(), [Deal.Schema]).entities || {};
        dispatch({
            type: OPPORTUNITY_LOAD_SUCCESS,
            userId: userId,
            entities: Map(entities),
            payload: Map({
                deals,
                archivedDeals
            })
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
