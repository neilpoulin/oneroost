import React from "react"
import UserSettingsForm from "UserSettingsForm"
import ConnectedProviders from "ConnectedProviders"

const UserSettingsPage = React.createClass({

    render () {
        return <div className="UserSettingsPage">
            <UserSettingsForm/>
            <ConnectedProviders/>
        </div>
    }
})

export default UserSettingsPage
