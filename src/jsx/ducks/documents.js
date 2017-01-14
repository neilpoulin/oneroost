import * as Document from "models/Document"
import * as Deal from "models/Deal"
import {normalize} from "normalizr"
import Parse from "parse"

export const ADD_DOCUMENT = "ADD_DOCUMENT"
export const DOCUMENT_LOAD_REQUEST = "DOCUMENT_LOAD_REQUEST"
export const DOCUMENT_LOAD_SUCCESS = "DOCUMENT_LOAD_SUCCESS"
export const DOCUMENT_LOAD_ERROR = "DOCUMENT_LOAD_ERROR"


const initialState = {
    isLoading: false,
    ids: [],
}
export default function reducer(state=initialState, action){
    switch (action.type) {
        case DOCUMENT_LOAD_REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case DOCUMENT_LOAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                ids: action.payload.map(doc => doc.objectId)
            }
        case DOCUMENT_LOAD_ERROR:
            return{
                ...state,
                isLoading: false,
            }
        default:
            return state;
    }
}

export const loadDocuments = (dealId) => (dispatch) => {
    dispatch({
        type: DOCUMENT_LOAD_REQUEST,
        dealId: dealId,
    })
    let documentsQuery = new Parse.Query(Document.className);
    documentsQuery.equalTo( "deal", Deal.Pointer(dealId) )
    documentsQuery.find().then(documents => {
        let json = documents.map(doc => doc.toJSON())
        let normalized = normalize(json, [Document.Schema])
        dispatch({
            type: DOCUMENT_LOAD_SUCCESS,
            dealId: dealId,
            payload: json,
            entities: normalized.entities || {}
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
