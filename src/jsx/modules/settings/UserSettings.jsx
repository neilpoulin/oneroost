import React, { PropTypes } from "react"
import {connect} from "react-redux"
import * as RoostUtil from "RoostUtil"
import BasicInfo from "profile/BasicInfo"
import {saveUser, fetchUserPermissions} from "ducks/user"
import {loadTemplates} from "ducks/userTemplates"

const UserSettings = React.createClass({
    propTypes: {
        user: PropTypes.object,
        saveUser: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
    },
    render () {
        const {user, saveUser, isLoading} = this.props
        if (isLoading){
            return <div><i className="fa fa-spinner fa-spin fa-2x"></i> Loading</div>
        }
        return (
            <div>
                <BasicInfo user={user} saveUser={saveUser}/>
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const userState = state.user.toJS()
    const user = RoostUtil.getCurrentUser(state)

    return {
        user,
        isLoading: userState.isLoading,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveUser: (changes) => dispatch(saveUser(changes)),
        loadData: (userId) => {
            dispatch(loadTemplates(userId))
            dispatch(fetchUserPermissions())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings)
