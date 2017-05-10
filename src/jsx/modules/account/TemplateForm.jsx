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
import * as Template from "models/Template"
import * as log from "LoggingUtil"
import {LINK_TYPE_OPTIONS} from "LinkTypes"

const TemplateForm = React.createClass({
    propTypes: {
        department: PropTypes.string,
        users: PropTypes.arrayOf(PropTypes.shape({
            displayText: PropTypes.string,
            value: PropTypes.string.isRequired
        })),
        userId: PropTypes.string,
        accountId: PropTypes.string,
        templateId: PropTypes.string,
        template: PropTypes.shape({
            objectId: PropTypes.string,
            title: PropTypes.string,
            description: PropTypes.string,
            createdBy: PropTypes.shape({
                objectId: PropTypes.string.isRequired
            }),
            ownedBy: PropTypes.shape({
                objectId: PropTypes.string.isRequired
            })
        })
    },
    getDefaultProps(){
        department: ""
    },
    getInitialState(){
        let {template={}} = this.props
        template = template || {}
        let requirements = template.requirements || []
        requirements = requirements.map(req => {
            req.hasCta = false
            if (req.navLink){
                req.ctaType = req.navLink.type
                req.ctaText = req.navLink.text
                req.hasCta = true
            }
            return req;
        })
        return {
            title: template.title || "",
            description: template.description || "",
            requirementsDisplay: template.requirementsDisplay || ["MESSAGE", "LIST"],
            ownedBy: template.ownedBy ? template.ownedBy.objectId : this.props.userId,
            department: template.department || this.props.department,
            requirements: requirements,
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
            requirements,
        } = this.state
        const {templateId, departments} = this.props
        const departmentObject = departments.find(dept => dept.value === department)
        const {
            userId,
            accountId,
        } = this.props
        const json = {
            title: departmentObject ? `${departmentObject.displayText} Vendors` : title,
            description,
            requirementsDisplay,
            account: accountId,
            ownedBy,
            createdBy: userId,
            modifiedBy: userId,
            department,
            active: true,
            objectId: templateId,
            requirements: requirements.map(req => {
                if(!req.ctaType){
                    return req
                }
                req.navLink = {type: req.ctaType, text: req.ctaText || req.ctaType}
                return req;
            }),
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
    handleRequirementChange(index, changes){
        try{
            let requirements = this.state.requirements
            let req = requirements[index]
            req = Object.assign(req, changes)
            requirements[index] = req
            this.setState({requirements})
        }
        catch(e){
            log.error(`No requirement found for index ${index} and changes `, changes, e)
        }
    },
    addRequirement(){
        let requirements = this.state.requirements;
        requirements.push({})
        this.setState({requirements})
    },
    removeRequirement(index){
        let requirements = this.state.requirements;
        if (requirements.length > index){
            requirements.splice(index, 1)
            this.setState({requirements})
        }
    },
    moveRequirement(index, change){
        let requirements = this.state.requirements;
        if (requirements.length > index){
            requirements.splice(index + change, 0, requirements.splice(index, 1)[0]);
            this.setState({requirements})
        }
    },
    render () {
        const {departments, users} = this.props
        const {
            description,
            // requirementsDisplay,
            department,
            ownedBy,
            errors,
            requirements,
        } = this.state
        return (
            <div className="CreateTemplateForm">
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

                <AutosizeTextArea
                    label="Description"
                    type="text"
                    fieldName="description"
                    value={description}
                    errors={errors}
                    onChange={value => this.setState({description: value})}
                    />

                <label>Requirements</label>
                <ul className="requirements" display-if={requirements}>
                    {requirements.map((req, i) => {
                        return (
                            <li className="requirement" key={`requirement_${i}`}>
                                <div className="header">
                                    <div>
                                        <span className="requirement-index">{i + 1}</span>
                                        <span className="btn btn-xs btn-outline-primary" display-if={i > 0} onClick={() => this.moveRequirement(i, -1)} >Move Up</span>
                                        <span className="btn btn-xs btn-outline-primary" display-if={i < requirements.length - 1} onClick={() => this.moveRequirement(i, 1)} >Move Down</span>
                                    </div>
                                    <div>
                                        <span className="action" onClick={() => this.removeRequirement(i)}><i className="fa fa-trash-o fa-lg"></i></span>
                                    </div>
                                </div>
                                <FormInputGroup
                                    label={"Title"}
                                    type="text"
                                    placeholder="Title"
                                    value={req.title || ""}
                                    fieldName={`requirement_${i}_title`}
                                    errors={errors}
                                    onChange={(value) => this.handleRequirementChange(i, {title: value})}
                                    />
                                <AutosizeTextArea
                                    label={"Description"}
                                    type="text"
                                    placeholder="Description"
                                    fieldName={`requirement_${i}_description`}
                                    value={req.description || ""}
                                    onChange={(value) => this.handleRequirementChange(i, {description: value})}
                                    errors={errors}
                                    />

                                <span display-if={!req.hasCta}
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => this.handleRequirementChange(i, {hasCta: true})}>
                                    Add CTA
                                </span>

                                <div display-if={req.hasCta}>
                                    <div className="ctaHeader">
                                        <label>Call to Action</label>
                                        <span className="ctaAction"
                                            onClick={() => this.handleRequirementChange(i, {hasCta: false, ctaText: null, ctaType: null})}
                                            >remove</span>
                                    </div>
                                    <div className="ctaContainer">
                                        <FormSelectGroup
                                            label={null}
                                            fieldName="cta"
                                            value={req.ctaType}
                                            errors={errors}
                                            fieldName={`requirement_${i}_ctaType`}
                                            options={LINK_TYPE_OPTIONS}
                                            placeholder={"CTA Type..."}
                                            onChange={(value) => this.handleRequirementChange(i, {ctaType: value.value})}
                                            />
                                        <FormInputGroup
                                            label={null}
                                            type="Call To Action Text"
                                            placeholder="CTA Text"
                                            fieldName={`requirement_${i}_ctaText`}
                                            value={req.ctaText || ""}
                                            errors={errors}
                                            onChange={(value) => this.handleRequirementChange(i, {ctaText: value})}
                                            />
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>

                <button className="btn btn-sm btn-secondary" onClick={this.addRequirement}><i className="fa fa-plus"></i> Add Requirement</button>
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const {templateId} = ownProps
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

    let template = {requirements: Template.defaultRequirements}
    if (templateId){
        template = denormalize(templateId, Template.Schema, entities)
    }

    return {
        userId,
        accountId,
        departments,
        users,
        template,
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

export default connect(mapStateToProps, mapDispatchToProps, undefined, connectOpts)(TemplateForm)
