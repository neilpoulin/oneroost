import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {fetchUserPermissions} from "ducks/user"
import {denormalize} from "normalizr"
import Spinner from "SpinnerIcon"
import * as Account from "models/Account"
import * as Template from "models/Template"
import {loadSettings} from "ducks/accountSettings"
import DepartmentCard from "DepartmentCard"

const CompanySettingsPage = React.createClass({
    propTypes: {
        account: PropTypes.object,
    },
    componentDidMount(){
        this.props.loadData()
    },
    render () {
        const {account, userRoles, isLoading, departments} = this.props
        if (isLoading){
            return <Spinner message="Loading..."/>
        }
        return (
            <div className="CompanySettingsPage">
                <h1><span display-if={account}>{account.accountName} </span>Company Settings</h1>
                <div display-if={userRoles}>
                    {`User Role${userRoles.length > 1 ? "s" : ""}:`} {userRoles.join(", ")}
                </div>
                <div>
                    <h2>Departments</h2>
                    <div className="departmentContainer">
                        {departments.map((department, i) => <DepartmentCard key={`department_${i}`} department={department}/>)}
                    </div>
                </div>
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const accountState = state.accountSettings.toJS()
    const entities = state.entities.toJS()
    const userState = state.user.toJS()
    const {isLoading, accountId, templateIds} = accountState
    let departmentMap = state.accountSettings.get("departmentMap", {})
    if (accountState.isLoading || userState.isLoading){
        return {isLoading}
    }

    const account = denormalize(accountId, Account.Schema, entities)
    const templates = denormalize(templateIds, [Template.Schema], entities)

// This assumes only one template per department
    departmentMap = templates.reduce((templateMap, template) => {
        return templateMap.setIn([template.department, "template"], template)
    }, departmentMap)

    let departments = departmentMap.toList().toJS().sort((dept1, dept2) => {
        return dept1.displayText.localeCompare(dept2.displayText)
    })
    return {
        isLoading,
        account,
        templates,
        departments: departments || [],
        userRoles: userState.roles
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadData: (userId) => {
            // dispatch(loadTemplates(userId))
            dispatch(loadSettings())
            dispatch(fetchUserPermissions())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanySettingsPage)
