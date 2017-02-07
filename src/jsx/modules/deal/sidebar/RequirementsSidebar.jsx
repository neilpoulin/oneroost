import React, { PropTypes } from "react"
import {connect} from "react-redux"

const RequirementsSidebar = React.createClass({
    propTypes: {
        deal: PropTypes.object
    },
    render () {
        // let {deal} = this.props;
        let sidebar =
        <div className="RequirementsSidebar">
            <h3 className="title">Requirements</h3>
        </div>

        return sidebar;
    }
})


const mapStateToProps = (state, ownprops) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {

    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequirementsSidebar)
