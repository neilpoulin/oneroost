import React, { PropTypes } from "react"
import {connect} from "react-redux"
import {saveTemplate} from "ducks/template"
import FormSelectGroup from "FormSelectGroup"
import FormInputGroup from "FormInputGroup"
import AutosizeTextArea from "AutosizeTextAreaFormGroup"
import TemplateValidation from "account/TemplateValidation"
import {getErrors, hasErrors} from "FormUtil"

const CreateTemplateForm = React.createClass({
    propTypes: {
        department: PropTypes.string,
    },
    getDefaultProps(){
        department: ""
    },
    getInitialState(){
        return {
            title: "",
            description: "",
            requirementsDisplay: ["MESSAGE", "LIST"],
            account: "",
            createdBy: "",
            ownedBy: "",
            department: this.props.department,
            errors: {},
        }
    },
    doSubmit(){
        const {
            title,
            description,
            requirementsDisplay,
            department
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
            ownedBy: userId,
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
        const {departments} = this.props
        const {
            title,
            description,
            requirementsDisplay,
            department,
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
    const departments = state.accountSettings.get("departmentMap")
    .toList()
    .toJS()
    .sort((dept1, dept2) => {
        return dept1.displayText.localeCompare(dept2.displayText)
    })

    return {
        userId,
        accountId,
        departments,
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
