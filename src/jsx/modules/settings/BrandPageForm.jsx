import React, { PropTypes } from "react"
import FormInputGroup from "FormInputGroup"
import FormSelectGroup from "FormSelectGroup"
import {isUrlAvailable, saveBrandPage} from "ducks/brandPageSettings"
import {matchesPattern, Validation, getErrors, hasErrors} from "FormUtil"
import {connect} from "react-redux"

const BrandPageForm = React.createClass({
    propTypes: {
        brand: PropTypes.shape({
            vanityUrl: PropTypes.string,
            templateIds: PropTypes.arrayOf(PropTypes.string)
        }),
        templatesOptions: PropTypes.shape({
            value: PropTypes.string.isRequired,
            displayText: PropTypes.string.isRequired,
        })
    },
    getInitialState(){
        const {vanityUrl, logoUrl, templateIds=[]} = this.props.brand
        return {
            errors: {},
            vanityUrl,
            logoUrl,
            templateIds,
            saveSuccess: false,
        }
    },
    _validations: {
        vanityUrl: new Validation(matchesPattern(/^[a-zA-Z0-9-_]+$/), "error", "The URL can only contain letters, numbers, and dashes"),
    },
    _doSave(){
        const {vanityUrl, templateIds} = this.state
        const {objectId} = this.props.brand
        this.props.saveBrandPage({
            vanityUrl,
            templateIds,
            objectId
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
            templateIds.splice(i, 1, selection.value)
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
        templateIds.push(value)
        this.setState({
            templateIds
        })
    },
    _filterTemplateOptions(includeId){
        const {templateOptions} = this.props
        let {templateIds} = this.state
        return templateOptions.filter(({value}) => templateIds.indexOf(value) === -1 || value === includeId)
    },
    render () {
        const {errors, vanityUrl, logoUrl, templateIds, saveSuccess} = this.state
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
                    value={logoUrl}
                    label="Logo URL"
                    errors={errors}
                    fieldName={"logoUrl"}
                    />
                <div className="logo-preview" display-if={logoUrl}>
                    <img src={logoUrl}/>
                </div>

                <label>Templates</label>
                {templateIds.map((templateId, i) =>
                    <FormSelectGroup
                        errors={errors}
                        value={templateId}
                        options={this._filterTemplateOptions(templateId)}
                        fieldName={`template_${i + 1}`}
                        key={`template_${i + 1}`}
                        onChange={(templateId) => this._handleTemplateChange(i, templateId)}
                        />
                )}

                <FormSelectGroup
                    display-if={nextOpts}
                    errors={errors}
                    value={""}
                    options={nextOpts}
                    fieldName={"template_new"}
                    onChange={this._handleNewTemplate}
                    />

                <button className="btn btn-outline-primary" onClick={this._submit}>Save</button>
                <div className="success" display-if={saveSuccess}>
                    Successfully Saved
                </div>
                </div>
        )
    }
})

export default connect(null, {
    saveBrandPage
})(BrandPageForm)
