import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {updateRequirement} from "ducks/roost/requirements"
import RequirementsRow from "sidebar/RequirementsRow"
import {getCurrentUser} from "RoostUtil"

const RequirementsTable = React.createClass({
    propTypes: {
        requirements: PropTypes.arrayOf(PropTypes.shape({
            completedDate: PropTypes.any,
            objectId: PropTypes.string,
        })),
        updateRequirement: PropTypes.func.isRequired,
        currentUser: PropTypes.object,
        deal: PropTypes.object.isRequired
    },
    render () {
        let {requirements, updateRequirement, currentUser, deal} = this.props
        return <table>
            <tbody>
                {requirements.map((req, i) =>
                    <RequirementsRow key={`requirements_row_${i}`}
                        requirement={req}
                        updateRequirement={updateRequirement}
                        currentUser={currentUser}
                        dealId={deal.objectId}
                    />
                )}
            </tbody>
        </table>
    }
})

const mapStateToProps = (state, ownProps) => {
    const currentUser = getCurrentUser(state)
    return {
        currentUser,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateRequirement: (requirement, changes, message) => {
            dispatch(updateRequirement(requirement, changes, message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequirementsTable)
