import moment from "moment"

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

export const formatDateLong = function(dateString){
    if (dateString != null && dateString != undefined) {
        return moment(dateString).format("dddd, MMMM Do, YYYY");
    }
    return null;
}

export const sortDatesAscending = (a, b) => {
    return moment(a) - moment(b)
}

export const sortDatesDescending = (a, b) => {
    return moment(b) - moment(a)
}

export const formatDurationAsDays = function(past){
    var numDays = Math.floor(moment.duration(moment().diff(past)).asDays());
    var formatted = numDays + " days ago";

    if (numDays < 1){
        formatted = "Today";
    }
    else if (numDays < 2){
        formatted = "Yesterday";
    }

    return formatted;
}

export const isSameDate = function(nextDate, previousDate){
    if (nextDate != null && !(nextDate instanceof Date)) {
        nextDate = new Date(nextDate)
    }
    if (previousDate != null && !(previousDate instanceof Date)) {
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
