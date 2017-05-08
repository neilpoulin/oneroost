import React, { PropTypes } from "react"
import {connect} from "react-redux"
import * as RoostUtil from "RoostUtil"
import UserSettingsDisplay from "UserSettingsDisplay"
import UserSettingsForm from "UserSettingsForm"
import {saveUser, fetchUserPermissions} from "ducks/user"

const UserSettings = React.createClass({
    propTypes: {
        user: PropTypes.object,
        saveUser: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
    },
    getInitialState(){
        return{
            isEdit: false
        }
    },
    doEdit(){
        this.setState({isEdit: true});
    },
    doDisplay(){
        this.setState({isEdit: false});
    },
    render () {
        const {user, saveUser, isLoading} = this.props
        if (isLoading){
            return <div><i className="fa fa-spinner fa-spin fa-2x"></i> Loading</div>
        }
        if (this.state.isEdit){
            return <UserSettingsForm user={user} doCancel={() => this.setState({isEdit: false})} afterSave={this.doDisplay} saveUser={saveUser}/>
        }
        return <UserSettingsDisplay user={user} doEdit={() => this.setState({isEdit: true})}/>
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
            dispatch(fetchUserPermissions())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings)
