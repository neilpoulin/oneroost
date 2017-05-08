import React, { PropTypes } from "react"
import {connect} from "react-redux"
import {saveTemplate} from "ducks/template"
import FormSelectGroup from "FormSelectGroup"
import FormInputGroup from "FormInputGroup"
import AutosizeTextArea from "AutosizeTextAreaFormGroup"
import TemplateValidation from "account/TemplateValidation"
import {getErrors, hasErrors} from "FormUtil"
import {denormalize} from "normalizr"
import * as User from "models/User"

const CreateTemplateForm = React.createClass({
    propTypes: {
        department: PropTypes.string,
        users: PropTypes.arrayOf(PropTypes.shape({
            displayText: PropTypes.string,
            value: PropTypes.string.isRequired
        })),
        userId: PropTypes.string,
        accountId: PropTypes.string,
    },
    getDefaultProps(){
        department: ""
    },
    getInitialState(){
        return {
            title: "",
            description: "",
            requirementsDisplay: ["MESSAGE", "LIST"],
            ownedBy: this.props.userId,
            department: this.props.department,
            users: [],
            errors: {},
        }
    },
    doSubmit(){
        const {
            title,
            description,
            requirementsDisplay,
            department,
            ownedBy,
        } = this.state
        const {
            userId,
            accountId,
        } = this.props
        const json = {
            title,
            description,
            requirementsDisplay,
            account: accountId,
            ownedBy,
            createdBy: userId,
            modifiedBy: userId,
            department,
            active: true,
        }

        let errors = getErrors(json, TemplateValidation)
        if (!hasErrors(errors)){
            this.props.submit(json)
            this.setState({errors: {}})
            return true
        }
        this.setState({errors})
        return false
    },
    render () {
        const {departments, users} = this.props
        const {
            title,
            description,
            requirementsDisplay,
            department,
            ownedBy,
            errors,
        } = this.state
        return (
            <div className="createTemplateForm">
                <FormSelectGroup
                    label={"Department"}
                    fieldName="department"
                    value={department}
                    errors={errors}
                    options={departments}
                    onChange={(value) => this.setState({department: value.value})}
                    />

                <FormSelectGroup
                    label={"Owner"}
                    fieldName="ownedBy"
                    value={ownedBy}
                    errors={errors}
                    options={users}
                    onChange={(value) => this.setState({ownedBy: value.value})}
                    />

                <FormInputGroup
                    label="Title"
                    type="text"
                    fieldName="title"
                    value={title}
                    errors={errors}
                    onChange={value => this.setState({title: value})}
                    />
                <AutosizeTextArea
                    label="Description"
                    type="text"
                    fieldName="description"
                    value={description}
                    errors={errors}
                    onChange={value => this.setState({description: value})}
                    />
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const userState = state.user.toJS()
    const {userId, accountId} = userState
    const entities = state.entities.toJS()
    const departments = state.accountSettings.get("departmentMap")
    .toList()
    .toJS()
    .sort((dept1, dept2) => {
        return dept1.displayText.localeCompare(dept2.displayText)
    })
    const userIds = state.accountSettings.get("userIds").toJS()
    const users = denormalize(userIds, [User.Schema], entities).map(user => {
        return {
            compareName: (user.lastName || "") + (user.firstName || ""),
            displayText: user.firstName + " " + user.lastName,
            value: user.objectId,
        }
    }).sort((u1, u2) => {
        return u1.compareName.toUpperCase().localeCompare(u2.compareName.toUpperCase())
    })

    return {
        userId,
        accountId,
        departments,
        users,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        submit: (json) => {
            dispatch(saveTemplate(json))
        }
    }
}

const connectOpts = {
    withRef: true
}

export default connect(mapStateToProps, mapDispatchToProps, undefined, connectOpts)(CreateTemplateForm)
