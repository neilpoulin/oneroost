import React, { PropTypes } from "react"
import {connect} from "react-redux"
import {updateRequirement} from "ducks/roost/requirements"
import {denormalize} from "normalizr"
import * as User from "models/User"
import * as RoostUtil from "RoostUtil"
// import * as Requirement from "models/Requirement"

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
    handleClick(e, requirement){
        const el = e.target;
        const value = el.checked
        let changes = {
            completedDate: value ? new Date() : null
        }
        let message = RoostUtil.getFullName(this.props.user) + " marked requirement " + requirement.title + " as " + (value ? "completed" : "not completed")

        this.props.updateRequirement(requirement, changes, message);
    },
    render () {
        let {requirements} = this.props;

        let content =
        <div>
            This feature is currently under development.
            If you would like to add requirements to your opportunity, please contact <a href="mailto:info@oneroost.com">info@oneroost.com</a>
        </div>
        if (requirements.length > 0){
            content = <table>
                <tbody>
                    {requirements.map((req, i) => {
                        return <tr key={"requirement_" + i} >
                            <td>
                                <input type="checkbox"
                                    onChange={e => this.handleClick(e, req)}
                                    checked={req.completedDate ? true : false}
                                    value={req.completedDate ? true : false}/>
                            </td>
                            <td>
                                <div className="title">{req.title}</div>
                                <div className="description">{req.description}</div>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
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

    return {
        updateRequirement: (requirement, changes, message) => {
            dispatch(updateRequirement(requirement, changes, message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequirementsSidebar)
