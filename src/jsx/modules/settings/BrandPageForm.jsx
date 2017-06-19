import React, { PropTypes } from "react"
import FormInputGroup from "FormInputGroup"
import FormSelectGroup from "FormSelectGroup"
import {isUrlAvailable, saveBrandPage} from "ducks/brandPageSettings"
import {matchesPattern, Validation, getErrors, hasErrors} from "FormUtil"
import * as Template from "models/Template"
import {connect} from "react-redux"
import {Link} from "react-router"

const BrandPageForm = React.createClass({
    propTypes: {
        brand: PropTypes.shape({
            vanityUrl: PropTypes.string,
            templateIds: PropTypes.arrayOf(PropTypes.object)
        }),
        templatesOptions: PropTypes.shape({
            value: PropTypes.string.isRequired,
            displayText: PropTypes.string.isRequired,
        })
    },
    getInitialState(){
        const {vanityUrl="", logoUrl="", templateIds=[], description="", descriptionLabel="", pageTitle=""} = this.props.brand
        return {
            errors: {},
            vanityUrl,
            logoUrl,
            templateIds,
            saveSuccess: false,
            description,
            descriptionLabel,
            pageTitle,
        }
    },
    _validations: {
        vanityUrl: new Validation(matchesPattern(/^[a-zA-Z0-9-_]+$/), "error", "The URL can only contain letters, numbers, and dashes"),
    },
    _doSave(){
        const {vanityUrl, templateIds, description, descriptionLabel, pageTitle, logoUrl} = this.state
        const {objectId} = this.props.brand
        this.props.saveBrandPage({
            vanityUrl,
            templateIds,
            description,
            descriptionLabel,
            objectId,
            pageTitle,
            logoUrl,
        })
        this.setState({saveSuccess: true})
        window.setTimeout(() => this.setState({saveSuccess: false}), 3000)
    },
    _submit(){
        var errors = getErrors(this.state, this._validations);
        if (!hasErrors(errors)){
            const {vanityUrl} = this.state
            const originalUrl = this.props.brand.vanityUrl
            if (vanityUrl !== originalUrl){
                isUrlAvailable(vanityUrl).then(isAvailable => {
                    if (!isAvailable){
                        this.setState({errors: {
                            vanityUrl: {
                                level: "warning",
                                message: "The url you have entered is not avilable"
                            }}});
                        return false
                    }
                    this._doSave()
                })
                return true;
            }
            else {
                this._doSave()
            }
        }

        this.setState({errors: errors});
        return false;
    },
    _handleTemplateChange(i, selection){
        let {templateIds=[]} = this.state
        if (selection){
            templateIds.splice(i, 1, Template.Pointer(selection.value))
        }
        else {
            templateIds.splice(i, 1)
        }
        this.setState({
            templateIds
        })
    },
    _handleNewTemplate({value}){
        const {templateIds=[]} = this.state
        templateIds.push(Template.Pointer(value))
        this.setState({
            templateIds
        })
    },
    _filterTemplateOptions(includeId){
        const {templateOptions} = this.props
        let templateIds = this.state.templateIds.map(template => template.objectId)
        return templateOptions.filter(({value}) => templateIds.indexOf(value) === -1 || value === includeId)
    },
    render () {
        const {templateOptions} = this.props
        const {errors, vanityUrl, logoUrl, templateIds, saveSuccess, description, descriptionLabel, pageTitle} = this.state
        let nextOpts = this._filterTemplateOptions(null)
        return (
            <div className="BrandPageForm">
                <FormInputGroup
                    value={vanityUrl}
                    label="Page URL"
                    errors={errors}
                    fieldName="vanityUrl"
                    pattern={/^[a-zA-Z0-9-_]+$/}
                    onChange={(val) => this.setState({vanityUrl: val ? val.trim().toLowerCase() : ""})}
                    />
                <FormInputGroup
                    value={pageTitle}
                    label="Page Title (Optional)"
                    errors={errors}
                    fieldName="pageTitle"
                    onChange={(val) => this.setState({pageTitle: val})}
                    />
                <FormInputGroup
                    value={logoUrl}
                    label="Logo URL"
                    errors={errors}
                    fieldName={"logoUrl"}
                    onChange={(val) => this.setState({logoUrl: val})}
                    />
                <div className="logo-preview" display-if={logoUrl}>
                    <img src={logoUrl}/>
                </div>
                <FormInputGroup
                    value={description}
                    label="Description"
                    errors={errors}
                    fieldName={"description"}
                    onChange={(val) => this.setState({description: val})}
                    />
                <FormInputGroup
                    value={descriptionLabel}
                    label="Description Label"
                    errors={errors}
                    fieldName={"descriptionLabel"}
                    onChange={(val) => this.setState({descriptionLabel: val})}
                    />
                <div display-if={templateOptions.length > 0}>
                    <label>Templates</label>
                    {templateIds.map((template, i) =>
                        <FormSelectGroup
                            errors={errors}
                            value={template.objectId}
                            options={this._filterTemplateOptions(template.objectId)}
                            fieldName={`template_${i + 1}`}
                            key={`template_${i + 1}`}
                            onChange={(value) => this._handleTemplateChange(i, value)}
                            />
                    )}

                    <FormSelectGroup
                        display-if={nextOpts && nextOpts.length > 0}
                        errors={errors}
                        value={""}
                        options={nextOpts}
                        fieldName={"template_new"}
                        onChange={this._handleNewTemplate}
                        />
                </div>
                <div display-if={templateOptions.length === 0}>
                    <label>Templates</label>
                    <p>You do not have any templates configured. Please to to <Link to="settings/company">Company Settings</Link> to configure some.</p>
                </div>
                <div>
                    <button className="btn btn-outline-primary" onClick={this._submit}>Save</button>
                    <div className="success" display-if={saveSuccess}>
                        Successfully Saved
                    </div>
                </div>
            </div>
        )
    }
})

export default connect(null, {
    saveBrandPage
})(BrandPageForm)
