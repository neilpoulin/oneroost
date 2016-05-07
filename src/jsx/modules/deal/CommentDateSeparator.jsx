import React, { PropTypes } from "react";
import moment from "moment";
const CommentDateSeparator = React.createClass({
    propTypes: {
        nextDate: PropTypes.instanceOf(Date).isRequired,
        previousDate: PropTypes.instanceOf(Date)
    },
    isSameDate()
    {
        var dateToCheck = this.props.nextDate;
        var actualDate = this.props.previousDate;
        var isSameDay = actualDate != null
        && dateToCheck.getDate() == actualDate.getDate()
        && dateToCheck.getMonth() == actualDate.getMonth()
        && dateToCheck.getFullYear() == actualDate.getFullYear();
        return isSameDay;
    },
    getFormattedDate( date )
    {
        return moment(date).format("dddd, MMM Do, YYYY");
    },
    render () {

        var separator = null;
        if ( !this.isSameDate() )
        {
            separator =
            <li className="dateSeparator text-center">
                <span className="dateLabel">
                    {this.getFormattedDate( this.props.nextDate )}
                </span>
            </li>
        }

        return separator
    }
})

export default CommentDateSeparator
