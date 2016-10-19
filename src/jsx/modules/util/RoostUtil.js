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
