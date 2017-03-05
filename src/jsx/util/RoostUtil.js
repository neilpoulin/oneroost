import Parse from "parse"
import moment from "moment"
import numeral from "numeral"
import {Map, fromJS, Iterable} from "immutable"
import {denormalize} from "normalizr"
import * as User from "models/User"
import * as log from "LoggingUtil"

export const transformDatesInObject = (json) => {
    Object.keys(json).forEach(key => {
        let value = json[key]
        if ( value !== null && typeof value === "object" ){
            if ( value["__type"] === "Date" && value["iso"] ){
                json[key] = moment(value["iso"]).toDate()
            }
        }
    })
    return json
}

export const toJSON = function(obj){
    if ( !obj ){
        return obj
    }
    let json = obj
    if ( Iterable.isIterable(obj) ){
        json = json.toJS()
    } else if ( obj instanceof Parse.Object ){
        json = obj.toJSON()
    }
    // Transform stupid Parse dates into iso strings
    json = transformDatesInObject(json)
    return json
}

export const copyJSON = function(json){
    if ( !json ){
        return json;
    }
    if ( json instanceof Parse.Object ){
       json = json.toJSON()
    }
    if ( Iterable.isIterable(json) ){
        json = json.toJS()
    }
    let copy = fromJS(json).toJS()
    if ( copy["__type"] ){
        delete copy["__type"]
    }
    // Transform stupid Parse dates into iso strings
    json = transformDatesInObject(json)
    return copy
}

export const getCurrentUser = function(state){
    if ( !state ){
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

export const getFullName = function( parseUser ){
    var fullName = ""
    try{
        if ( parseUser instanceof Parse.User ){
            fullName = parseUser.get("firstName") + " " + parseUser.get("lastName")
        }
        else {
            fullName = parseUser.firstName + " " + parseUser.lastName
        }
    } catch (e){
        log.warn("unable to parse user name, returning empty");
    }

    return fullName.trim()
}

export const formatDate = function(dateString){
    if (dateString != null && dateString != undefined) {
        return moment(dateString).format("MMM D, YYYY");
    }
    return null;
}

export const formatDateShort = function(dateString){
    if (dateString != null && dateString != undefined) {
        return moment(dateString).format("YYYY-MM-DD");
    }
    return null;
}

export const formatMoney = function(amount, includeSymbol){
    var format = "($0[.]0a)";
    if (!includeSymbol) {
        format = "(0[.]0a)"
    }
    return numeral(amount).format(format);
}

export const formatDurationAsDays = function( past ){
    var numDays = Math.floor( moment.duration( moment().diff(past)).asDays() );
    var formatted = numDays + " days ago";

    if ( numDays < 1 ){
        formatted = "Today";
    }
    else if ( numDays < 2){
        formatted = "Yesterday";
    }

    return formatted;
}

export const isSameDate = function(nextDate, previousDate)
{
    if (nextDate != null && !(nextDate instanceof Date ) )
    {
        nextDate = new Date( nextDate )
    }
    if ( previousDate != null && !(previousDate instanceof Date) )
    {
        previousDate = new Date(previousDate)
    }
    var dateToCheck = nextDate;
    var actualDate = previousDate;
    var isSameDay = actualDate != null
    && dateToCheck.getDate() == actualDate.getDate()
    && dateToCheck.getMonth() == actualDate.getMonth()
    && dateToCheck.getFullYear() == actualDate.getFullYear();
    return isSameDay;
}

export const isValidEmail = function(email){
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const isCurrentUser = function(user){
    if (user){
        let userId = user.objectId || user.id;
        if ( typeof userId === "object" ){
            userId = userId.objectId;
        }
        log.warn("Using Parse.User in method isCurrentUser")
        return Parse.User.current().id === userId
    }
    return false;
}

export const isNotCurrentUser = function(user){
    return !isCurrentUser(user);
}

function getRoostNameForParseUser( deal, displayFor ){
    let readyRoostUser = deal.get("readyRoostUser");
    let account = deal.get("account");
    displayFor = displayFor || this.getCurrentUser();
    let createdBy = deal.get("createdBy");

    let isCreator = isCurrentUser(createdBy);
    let isReadyRoostUser = isCurrentUser(readyRoostUser);

    if ( !createdBy ){
        log.warn("There is no created by on the deal object", deal);
    }

    let roostName = "";
    if ( createdBy && !isCreator && createdBy.get("company") ){
        roostName = createdBy.get("company")
    } else if ( readyRoostUser && !isReadyRoostUser && readyRoostUser.get("company") ){
        roostName = readyRoostUser.get("company");
    } else{
        roostName = account.get("accountName");
    }
    return roostName;
}

/** Get the display name for the roost, contextual to the user passed in**/
export const getRoostDisplayName = function(deal, displayFor){
    if (deal instanceof Parse.Object || Map.isMap(deal)){
        // throw "Attempting to get roost name from a non parse object", deal;
        return getRoostNameForParseUser(deal, displayFor)
    }

    let readyRoostUser = deal.readyRoostUser;
    let account = deal.account;
    displayFor = displayFor || this.getCurrentUser();
    let createdBy = deal.createdBy;

    let isCreator = isCurrentUser(createdBy);
    let isReadyRoostUser = isCurrentUser(readyRoostUser);

    if ( !createdBy ){
        log.warn("There is no created by on the deal object", deal);
    }

    let roostName = "";
    if ( createdBy && !isCreator && createdBy.company ){
        roostName = createdBy.company
    } else if ( readyRoostUser && !isReadyRoostUser && readyRoostUser.company ){
        roostName = readyRoostUser.company;
    } else{
        roostName = account.accountName;
    }
    return roostName;
}


export const getBudgetString = (deal, notQuotedString="Not Quoted") => {
    if ( !deal ){
        return ""
    }
    var budget = deal.budget
    if (!budget) {
        return notQuotedString;
    }
    if (budget.low == budget.high) {
        if (budget.low > 0) {
            return this.formatMoney(budget.low, true);
        }
        return notQuotedString;
    }
    return formatMoney(budget.low, true) + " - " + formatMoney(budget.high, false);
}
