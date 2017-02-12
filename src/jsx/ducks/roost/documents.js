import * as Document from "models/Document"
import * as Deal from "models/Deal"
import {normalize} from "normalizr"
import Parse from "parse"
import {Map, List} from "immutable"
import * as RoostUtil from "RoostUtil"
import {createComment} from "ducks/roost/comments"
import * as log from "LoggingUtil"

export const ADD_DOCUMENT = "oneroost/documents/ADD_DOCUMENT"
export const DOCUMENT_LOAD_REQUEST = "oneroost/documents/DOCUMENT_LOAD_REQUEST"
export const DOCUMENT_LOAD_SUCCESS = "oneroost/documents/DOCUMENT_LOAD_SUCCESS"
export const DOCUMENT_LOAD_ERROR = "oneroost/documents/DOCUMENT_LOAD_ERROR"


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
        case ADD_DOCUMENT:
            state = state.set("ids", state.get("ids").push(action.payload.get("objectId")))
            break;
        default:
            break;
    }
    return state;
}


export const addDocument = (doc) => {
    let entities = normalize(doc.toJSON(), Document.Schema).entities
    return {
        type: ADD_DOCUMENT,
        dealId: doc.get("deal").id || doc.get("deal").get("objectId"),
        payload: doc,
        entities,
    }
}

export const createDocument = (dealId, newDoc) => (dispatch, getState) => {
    let doc = Document.fromJS(newDoc);
    var user = Parse.User.current();
    doc.set("createdBy", user);
    doc.set("deal", Deal.Pointer(dealId))
    doc.save().then( saved => {
        dispatch(addDocument(saved))
        let message = RoostUtil.getFullName(user) + " has uploaded " + saved.get("fileName")
        dispatch(createComment({
            deal: Deal.Pointer(dealId),
            message: message,
            author: null,
            username: "OneRoost Bot",
            navLink: {type: "document", id: saved.id}
        }))
    })
}

export const loadDocuments = (dealId, force=false) => (dispatch, getState) => {
    let {roosts} = getState();
    if ( roosts.has(dealId) && roosts.get(dealId).get("documents").get("hasLoaded") && !roosts.get(dealId).get("documents").get("isLoading") && !force ){
        log.warn("not loading documents, already loaded once")
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
        log.error(error);
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
