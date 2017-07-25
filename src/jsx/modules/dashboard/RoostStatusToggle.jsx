import React, { PropTypes } from "react"
import classnames from "classnames"
import {connect} from "react-redux"
import {
    INTERESTED,
    NOT_INTERESTED,
    NOT_SET,
    StatusOptions
} from "RoostStatus"
import {setStatus} from "ducks/roost/roost"

class RoostStatusToggle extends React.Component {
    static propTypes = {
        roostId: PropTypes.string.isRequired,
        status: PropTypes.oneOf([INTERESTED, NOT_INTERESTED, NOT_SET]),
        isApprover: PropTypes.bool,
    }

    static defaultProps = {
        status: NOT_SET
    }

    render () {
        const {
            status,
            setNotInterested,
            setInterested,
            isApprover,
        } = this.props

        return <div className="RoostStatusToggle">
            <span display-if={!isApprover}>{StatusOptions[status].displayText}</span>
            <div display-if={isApprover}>
                <span className={classnames({active: status === NOT_INTERESTED}, "option")}
                    onClick={setNotInterested}>
                    {StatusOptions[NOT_INTERESTED].displayText}
                </span>
                <span className={classnames({active: status === INTERESTED}, "option")}
                    onClick={setInterested}>
                    {StatusOptions[INTERESTED].displayText}
                </span>
            </div>

        </div>
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const roostId = ownProps.roostId
    return {
        setInterested: () => {
            dispatch(setStatus(roostId, INTERESTED))
        },
        setNotInterested: () => {
            dispatch(setStatus(roostId, NOT_INTERESTED))
        }
    }
}

export default connect(undefined, mapDispatchToProps)(RoostStatusToggle);
