import Notification from "Notification"
import {Map} from "immutable"

export const COMMENT_ADDED = "oneroost/notification/TRIGGER_BROWSER_NOTIFICATION"

const initialState = Map({})
export default function reducer(state=initialState, action){
    switch(action.type){
        case COMMENT_ADDED:
            let comment = action.payload;
            let dealId = action.dealId;
            Notification.sendNotification({
                title: comment.get("deal").get("dealName"),
                body: comment.get("message"),
                tag: comment.get("objectId"),
                path: `/roosts/${dealId}`,
                dispatch: action.dispatcher

            });
            break;
        default:
            break;
    }
    return state;
}
