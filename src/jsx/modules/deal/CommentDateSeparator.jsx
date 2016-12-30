import React, { PropTypes } from "react";
import moment from "moment";
import RoostUtil from "RoostUtil"
const CommentDateSeparator = React.createClass({
    propTypes: {
        nextDate: PropTypes.any.isRequired,
        previousDate: PropTypes.any
    },
    getFormattedDate( date )
    {
        return moment(date).format("dddd, MMM Do, YYYY");
    },
    render () {

        var separator = null;
        if ( !RoostUtil.isSameDate( this.props.nextDate, this.props.previousDate ) )
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
