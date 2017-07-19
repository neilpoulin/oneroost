import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import * as RoostUtil from "RoostUtil"
// import UserSettingsDisplay from "UserSettingsDisplay"
import UserSettingsForm from "UserSettingsForm"
import ConnectedProviders from "ConnectedProviders"
import {
    saveUser,
    fetchUserPermissions,
    refreshCachedUserData,
    linkUserWithProvider,
    linkUserWithProviderError,
    unlinkUserWithProvider,
} from "ducks/user"

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
    render () {
        const {user,
            saveUser,
            isLoading,
        } = this.props

        if (isLoading){
            return <div><i className="fa fa-spinner fa-spin fa-2x"></i> Loading</div>
        }

        return <div className="UserSettingsPage">
                <UserSettingsForm
                    user={user}
                    saveUser={saveUser}/>
                <ConnectedProviders/>
            </div>
    }
})

const mapStateToProps = (state, ownProps) => {
    const userState = state.user.toJS()
    const user = RoostUtil.getCurrentUser(state)
    const {connectedProviders} = userState
    return {
        user,
        connectedProviders,
        isLoading: userState.isLoading,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveUser: (changes) => dispatch(saveUser(changes)),
        loadData: (userId) => {
            dispatch(fetchUserPermissions())
            dispatch(refreshCachedUserData())
        },
        googleSuccess: (authData) => {
            const {familyName, givenName, email} = authData.profileObj || {}
            dispatch(linkUserWithProvider("google", {
                access_token: authData.accessToken,
                id: authData.googleId,
                firstName: givenName,
                lastName: familyName,
                email,
                username: email,
            }))
        },
        googleError: (error) => {
            dispatch(linkUserWithProviderError("google", error))
        },
        linkedinSuccess: (authData) => {
            dispatch(linkUserWithProvider("linkedin", authData))
        },
        linkedinError: (error) => {
            dispatch(linkUserWithProviderError("linkedin"), error)
        },
        unlinkProvider: (provider) => {
            dispatch(unlinkUserWithProvider(provider))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings)
