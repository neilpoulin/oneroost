import React from "react"
import PropTypes from "prop-types";
import {isSameDate, formatDateLong} from "DateUtil"
const CommentDateSeparator = React.createClass({
    propTypes: {
        nextDate: PropTypes.any.isRequired,
        previousDate: PropTypes.any
    },
    render () {
        var separator = null;
        if (!isSameDate(this.props.nextDate, this.props.previousDate)) {
            separator =
            <li className="dateSeparator text-center">
                <span className="dateLabel">
                    {formatDateLong(this.props.nextDate)}
                </span>
            </li>
        }

        return separator
    }
})

export default CommentDateSeparator
