import * as Document from "models/Document"
import * as Deal from "models/Deal"
import {normalize} from "normalizr"
import Parse from "parse"
import {Map, List} from "immutable"

export const ADD_DOCUMENT = "oneroost/ADD_DOCUMENT"
export const DOCUMENT_LOAD_REQUEST = "oneroost/DOCUMENT_LOAD_REQUEST"
export const DOCUMENT_LOAD_SUCCESS = "oneroost/DOCUMENT_LOAD_SUCCESS"
export const DOCUMENT_LOAD_ERROR = "oneroost/DOCUMENT_LOAD_ERROR"


export const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    ids: List([]),
})
export default function reducer(state=initialState, action){
    switch (action.type) {
        case DOCUMENT_LOAD_REQUEST:
            state = state.set("isLoading", true)
            break;
        case DOCUMENT_LOAD_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("hasLoaded", true)
            state = state.set("ids", List(action.payload.map(doc => doc.get("objectId"))))
            break;
        case DOCUMENT_LOAD_ERROR:
            state = state.set("isLoading", false)
            break
        default:
            break;
    }
    return state;
}

export const loadDocuments = (dealId, force=false) => (dispatch, getState) => {
    let {roosts} = getState();
    if ( roosts.has(dealId) && roosts.get(dealId).get("documents").get("hasLoaded") && !roosts.get(dealId).get("documents").get("isLoading") && !force ){
        console.warn("not loading documents, already loaded once")
        return null
    }
    dispatch({
        type: DOCUMENT_LOAD_REQUEST,
        dealId: dealId,
    })
    let documentsQuery = new Parse.Query(Document.className);
    documentsQuery.equalTo( "deal", Deal.Pointer(dealId) )
    documentsQuery.find().then(documents => {
        let json = documents.map(doc => doc.toJSON())
        let entities = normalize(json, [Document.Schema]).entities || {}
        dispatch({
            type: DOCUMENT_LOAD_SUCCESS,
            dealId: dealId,
            payload: List(json.map(Map)),
            entities: Map(entities)
        })
    }).catch(error => {
        console.error(error);
        dispatch({
            type: DOCUMENT_LOAD_ERROR,
            error: {
                error: error,
                message: "Failed to load documents",
                level: "ERROR"
            }
        })
    })

}
