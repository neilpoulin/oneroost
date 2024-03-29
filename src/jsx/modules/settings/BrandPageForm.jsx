import React from "react"
import PropTypes from "prop-types"
import FormInputGroup from "FormInputGroup"
import FormSelectGroup from "FormSelectGroup"
import {isUrlAvailable, saveBrandPage, deletePage} from "ducks/brandPageSettings"
import {togglePageOpen} from "ducks/brandSettingsAdmin"
import {matchesPattern, Validation, getErrors, hasErrors} from "FormUtil"
import * as Template from "models/Template"
import {connect} from "react-redux"
import {Link} from "react-router"
import Image from "Image"
import {Collapse} from "react-collapse"

const BrandPageForm = React.createClass({
    propTypes: {
        brand: PropTypes.shape({
            vanityUrl: PropTypes.string,
            templateIds: PropTypes.arrayOf(PropTypes.object)
        }),
        templatesOptions: PropTypes.shape({
            value: PropTypes.string.isRequired,
            displayText: PropTypes.string.isRequired,
        }),
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
                            }}
                        });
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
    _delete(){
        let confirm = window.confirm(`Are you sure you want to delete ${this.props.brand.vanityUrl || "(new page)"}?`)
        if (confirm){
            this.props.deletePage()
        }
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
    _toggleCollapse(){
        this.props.toggleCollapse()
    },
    render () {
        const {templateOptions, brand, isOpen} = this.props
        const {errors, vanityUrl, logoUrl, templateIds, saveSuccess, description, descriptionLabel, pageTitle} = this.state
        let nextOpts = this._filterTemplateOptions(null)
        return (
            <div className="BrandPageForm">
                <div>
                    <span onClick={this._toggleCollapse} className="collapse-button">
                        <i className={`fa fa-fw fa-caret-${isOpen ? "down" : "right"}`}></i> {brand.vanityUrl || "(new page)"}
                    </span>
                    <Link display-if={brand.vanityUrl} to={`/${brand.vanityUrl}`} target="_blank" onClick={this._toggleCollapse}>View Page <i className="fa fa-external-link"></i></Link>
                </div>

                <Collapse isOpened={isOpen}>
                    <div className="collapse-content">
                        <FormInputGroup
                            value={vanityUrl}
                            label="Page URL"
                            errors={errors}
                            fieldName="vanityUrl"
                            pattern={/^[a-zA-Z0-9-_]+$/}
                            onChange={(val) => this.setState({vanityUrl: val ? val.trim().toLowerCase() : ""})}
                            addonBefore="www.oneroost.com/"
                            description="This is the public-facing URL that you can share with prospective partners"
                            descriptionPosition="top"
                            />
                        <FormInputGroup
                            value={pageTitle}
                            label="Page Title (Optional)"
                            errors={errors}
                            fieldName="pageTitle"
                            onChange={(val) => this.setState({pageTitle: val})}
                            description="An Optional title to show at the top of the page"
                            descriptionPosition="top"
                            />
                        <FormInputGroup
                            value={logoUrl}
                            label="Logo URL"
                            errors={errors}
                            fieldName={"logoUrl"}
                            onChange={(val) => this.setState({logoUrl: val})}
                            />
                        <div className="logo-preview" display-if={logoUrl}>
                            <Image src={logoUrl} useErrorImage={true}/>
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
                            <p>You do not have any templates configured. Please to to <Link to="settings/templates">Company Settings</Link> to configure some.</p>
                        </div>
                        <div className="actions">
                            <div className="delete-action">
                                <button className="btn btn-outline-danger" onClick={this._delete}><i className="fa fa-trash-o"></i> Delete</button>
                            </div>
                            <div className="save-action">
                                <button className="btn btn-success" onClick={this._submit}><i className="fa fa-check"></i> Save</button>
                                <div className="success" display-if={saveSuccess}>
                                    Successfully Saved
                                </div>
                            </div>
                        </div>
                    </div>
                </Collapse>
            </div>
        )
    }
})

const mapDispatchToProps = (dispatch, ownProps) => {
    const {brand} = ownProps
    const brandPageId = brand.objectId
    return {
        saveBrandPage: (object) => dispatch(saveBrandPage(object)),
        deletePage: () => {
            dispatch(deletePage(brandPageId))
        },
        toggleCollapse: () => {
            dispatch(togglePageOpen(brandPageId))
        }
    }
}

export default connect(null, mapDispatchToProps)(BrandPageForm)
