import Parse from "parse"
import moment from "moment"
import numeral from "numeral"

exports.getCurrentUser = function(){
    return Parse.User.current();
}

exports.getFullName = function( parseUser ){
    var fullName
    if ( parseUser instanceof Parse.User ){
        fullName = parseUser.get("firstName") + " " + parseUser.get("lastName")
    }
    else {
        fullName = parseUser.firstName + " " + parseUser.lastName
    }

    return fullName.trim()
}

exports.formatDate = function(dateString){
    if (dateString != null && dateString != undefined) {
        return moment(dateString).format("MMM D, YYYY");
    }
    return null;
}

exports.formatMoney = function(amount, includeSymbol){
    var format = "($0[.]0a)";
    if (!includeSymbol) {
        format = "(0[.]0a)"
    }
    return numeral(amount).format(format);
}

exports.formatDurationAsDays = function( past ){
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

exports.isSameDate = function(nextDate, previousDate)
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

exports.isValidEmail = function(email){
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

exports.isNotCurrentUser = function(user){
    return !this.isCurrentUser(user);
}

exports.isCurrentUser = function(user){
    if (user){
        let userId = user.objectId || user.id;
        if ( typeof userId === "object" ){
            userId = userId.objectId;
        }

        return Parse.User.current().id === userId
    }
    return false;
}



/** Get the display name for the roost, contextual to the user passed in**/
exports.getRoostDisplayName = function(deal, displayFor){
    let readyRoostUser = deal.readyRoostUser;
    let account = deal.account;
    displayFor = displayFor || this.getCurrentUser();
    let createdBy = deal.createdBy;

    let isCreator = this.isCurrentUser(createdBy);
    let isReadyRoostUser = this.isCurrentUser(readyRoostUser);

    let roostName = "";
    if ( !isCreator && createdBy.company ){
        roostName = createdBy.company
    } else if ( readyRoostUser && !isReadyRoostUser && readyRoostUser.company ){
        roostName = readyRoostUser.company;
    } else{
        roostName = account.accountName;
    }
    return roostName;
}
