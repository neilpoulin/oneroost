import Parse from "parse"
import moment from "moment"
import {Map, fromJS, Iterable} from "immutable"
import {denormalize} from "normalizr"
import * as User from "models/User"
import * as log from "LoggingUtil"

export const transformDatesInObject = (json) => {
    Object.keys(json).forEach(key => {
        let value = json[key]
        if (value !== null && typeof value === "object"){
            if (value["__type"] === "Date" && value["iso"]){
                json[key] = moment(value["iso"]).toDate()
            }
        }
    })
    return json
}

export const toJSON = function(obj){
    if (!obj){
        return obj
    }
    let json = obj
    if (Iterable.isIterable(obj)){
        json = json.toJS()
    }
    else if (obj instanceof Parse.Object){
        json = obj.toJSON()
    }
    // Transform stupid Parse dates into iso strings
    json = transformDatesInObject(json)
    return json
}

export const copyJSON = function(json){
    if (!json){
        return json;
    }
    if (json instanceof Parse.Object){
        json = json.toJSON()
    }
    if (Iterable.isIterable(json)){
        json = json.toJS()
    }
    let copy = fromJS(json).toJS()
    if (copy["__type"]){
        delete copy["__type"]
    }
    // Transform stupid Parse dates into iso strings
    json = transformDatesInObject(json)
    return copy
}

export const getCurrentUser = function(state){
    if (!state){
        log.warn("No 'state' passed in to RoostUtil.getCurrentUser()... using Parse.User.current() ")
        return Parse.User.current();
    }
    let stateUser = state.user
    if (Iterable.isIterable(state.user)){
        stateUser = state.user.toJS()
    }

    let userId = stateUser.userId
    let entities = state.entities.toJS()
    const currentUser = userId ? denormalize(userId, User.Schema, entities) : null
    return toJSON(currentUser)
}

export const getFullName = function(parseUser){
    var fullName = ""
    try{
        if (parseUser instanceof Parse.User || Iterable.isIterable(parseUser)){
            fullName = parseUser.get("firstName") + " " + parseUser.get("lastName")
        }
        else {
            fullName = parseUser.firstName + " " + parseUser.lastName
        }
    }
    catch (e){
        log.warn("unable to parse user name, returning empty");
    }

    return fullName.trim()
}

export const isValidEmail = function(email){
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const isCurrentUser = function(user, currentUser){
    if (user){
        let userId = user.objectId || user.id;
        if (typeof userId === "object"){
            userId = userId.objectId;
        }

        let currentUserId = null
        if (!currentUser){
            log.warn("Using Parse.User in method isCurrentUser")
            currentUserId = Parse.User.current().id
        }
        else {
            currentUserId = currentUser.objectId || currentUser.userId
        }
        return currentUserId === userId
    }
    return false;
}

export const isNotCurrentUser = function(user, currentUser){
    return !isCurrentUser(user, currentUser);
}

export function getCompanyName(user){
    if (!user){
        return null
    }
    user.get("account")
}

function getRoostNameForParseUser(deal, displayFor, currentUser){
    log.warn("Using getRoostNameForParseUser")
    let readyRoostUser = deal.get("readyRoostUser");
    displayFor = displayFor || getCurrentUser();
    let createdBy = deal.get("createdBy");

    let isCreator = isCurrentUser(createdBy, currentUser);
    let isReadyRoostUser = isCurrentUser(readyRoostUser, currentUser);

    if (!createdBy){
        log.warn("There is no created by on the deal object", deal);
    }
    let roostComapnyName = readyRoostUser ? readyRoostUser.get("company") : null
    if (readyRoostUser && readyRoostUser.get("account")){
        roostComapnyName = readyRoostUser.get("account").get("accountName")
    }

    let ownCompanyName = createdBy ? createdBy.get("company") : null
    if (createdBy.get("account")){
        ownCompanyName = createdBy.get("account").get("accountName")
    }

    let roostName = "";
    if (createdBy && !isCreator && ownCompanyName){
        roostName = ownCompanyName
    }
    else if (readyRoostUser && !isReadyRoostUser && roostComapnyName){
        roostName = roostComapnyName;
    }
    else{
        roostName = deal.get("dealName")
    }
    return roostName;
}

/** Get the display name for the roost, contextual to the user passed in**/
export const getRoostDisplayName = function(deal, displayFor){
    if (deal instanceof Parse.Object || Map.isMap(deal)){
        // throw "Attempting to get roost name from a non parse object", deal;
        return getRoostNameForParseUser(deal, displayFor, displayFor)
    }

    let readyRoostUser = deal.readyRoostUser;
    displayFor = displayFor || getCurrentUser();
    let createdBy = deal.createdBy;

    let isCreator = createdBy && createdBy.objectId == displayFor.objectId
    let isReadyRoostUser = readyRoostUser && readyRoostUser.objectId == displayFor.objectId

    if (!createdBy){
        log.warn("There is no created by on the deal object", deal);
    }

    let roostName = "";
    if (createdBy && !isCreator){
        roostName = createdBy.account ? createdBy.account.accountName : createdBy.company
    }
    else if (readyRoostUser && !isReadyRoostUser){
        roostName = readyRoostUser.account ? readyRoostUser.account.accountName : readyRoostUser.company;
    }
    else{
        roostName = deal.dealName;
    }
    return roostName;
}
