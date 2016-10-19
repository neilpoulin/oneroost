import Parse from "parse"
import moment from "moment"
import numeral from "numeral"

exports.getCurrentUser = function(){
    return Parse.User.current();
}

exports.getFullName = function( parseUser ){
    var fullName = parseUser.get("firstName") + " " + parseUser.get("lastName")
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
