import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {denormalize} from "normalizr"
import * as User from "models/User"
import RequirementsTable from "sidebar/RequirementsTable"

const RequirementsSidebar = React.createClass({
    propTypes: {
        deal: PropTypes.object,
        requirements: PropTypes.arrayOf(PropTypes.object),
    },
    getDefaultProps() {
        return {
            requirements: []
        }
    },
    render () {
        let {requirements, deal} = this.props;

        let content =
        <div>
            This feature is currently under development.
            If you would like to add requirements to your opportunity, please contact <a href="mailto:info@oneroost.com">info@oneroost.com</a>
        </div>
        if (requirements.length > 0){
            content = <RequirementsTable requirements={requirements} deal={deal}/>
        }

        let sidebar =
        <div className="RequirementsSidebar">
            <h3 className="title">Requirements</h3>
            {content}

        </div>

        return sidebar;
    }
})

const mapStateToProps = (state, ownProps) => {
    let entities = state.entities.toJS()
    // let deal = ownProps.deal;
    // let dealId = ownProps.deal.objectId
    let userId = state.user.get("userId")
    let user = denormalize(userId, User.Schema, entities);
    return {
        user,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(RequirementsSidebar)
