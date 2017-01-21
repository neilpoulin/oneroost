import User from "models/User"
import {Map, List} from "immutable"

const initialState = Map({
    isLoading: false,
    userId: null,
    admin: false,
    user: null, // parse user representation

});

export default function reducer(state=initialState, action){
    switch (action.type) {
        case "expression":

            break;
        default:
            break;
    }
    return state;
}
