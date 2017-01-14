// import { createAction } from "redux-actions";
import DealComment from "models/DealComment";

export const ADD_COMMENT = "ADD_COMMENT"
export const COMMENTS_LOAD_REQUEST = "COMMENTS_LOAD_REQUEST"
export const COMMENTS_LOAD_ERROR = "COMMENTS_LOAD_ERROR"
export const COMMENTS_LOAD_SUCCESS = "COMMENTS_LOAD_SUCCESS"
// import { normalize, schema } from "normalizr"

// Reducer
const initialState = {
    isLoading: false,
    ids: []
};
export default function reducer(state=initialState, action){
    switch (action.type) {
        case ADD_COMMENT:
            let {payload} = action;
            return {
                ...state,
                ids: [...state.ids,
                    payload.id
                ]
            }
        case COMMENTS_LOAD_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case COMMENTS_LOAD_SUCCESS:
            return {
                ...state,

                isLoading: false,
                ids: action.payoad.map(comment => comment.objectId)

            }
        default:
            return state
    }
}

// Actions

export const loadComments = function(dealId){
    return (dispatch) =>{
        dispatch({
            type: COMMENTS_LOAD_REQUEST,
            dealId: dealId
        });


    }
}

export const addComment = function(comment){
    return {
        type: ADD_COMMENT,
        dealId: comment.get("deal").id,
        payload: comment
    }
}

exports.createComment = function(message){
    return (dispatch) => {
        let comment = new DealComment();
        comment.set(message);
        comment.save().then(saved => {


            dispatch(addComment(saved));
        })
    }
}
