import React, { PropTypes } from "react"
import FormUtil, {Validation} from "./../util/FormUtil"
import FormInputGroup from "FormInputGroup"
import * as log from "LoggingUtil"
import FormSelect from "FormSelectGroup"
import ReactGA from "react-ga"

const OpportunityDetail = React.createClass({
    propTypes: {
        readyRoostUser: PropTypes.object.isRequired,
        currentUser: PropTypes.object,
        nextStep: PropTypes.func.isRequired,
        previousStep: PropTypes.func.isRequired,
        saveValues: PropTypes.func.isRequired,
        previousText: PropTypes.string,
        nextText: PropTypes.string,

        department: PropTypes.shape({
            displayText: PropTypes.string.isRequired,
            categories: PropTypes.arrayOf(PropTypes.shape({
                displayText: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
                subCategories: PropTypes.arrayOf(PropTypes.shape({
                    displayText: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired,
                })),
            })).isRequired,
        }).isRequired
    },
    getValidations(){
        return {
            company: new Validation(FormUtil.notNullOrEmpty, "error", "Please enter your company name"),
            category: new Validation(FormUtil.notNullOrEmpty, "error", "Please choose a category"),
        // subCategory: new Validation(FormUtil.notNullOrEmpty, "error", "Please choose a sub-category"),
        // problem: new Validation(FormUtil.notNullOrEmpty, "error", "Please briefly describe the problem you are trying to solve"),
        }
    },
    getDefaultProps: function(){
        return {
            previousText: "Previous Step",
            nextText: "Next Step"
        }
    },
    getInitialState(){
        return {
            company: this.props.fieldValues.company,
            problem: this.props.fieldValues.problem,
            category: this.props.fieldValues.category,
            subCategory: this.props.fieldValues.subCategory,
            subCategoryOther: this.props.fieldValues.subCategoryOther,
            errors: {}
        }
    },
    nextStep(){
        let validations = this.getValidations()
        if (this.state.subCategory && this.state.subCategory.value === "OTHER"){
            validations.subCategoryOther = new Validation(FormUtil.notNullOrEmpty, "error", "Please enter a value")
        }
        var errors = FormUtil.getErrors(this.state, validations);
        log.info(errors);
        if (Object.keys(errors).length === 0 && errors.constructor === Object){
            this.setState({errors: {}});
            this.props.saveValues({
                company: this.state.company,
                category: this.state.category,
                subCategory: this.state.subCategory,
                subCategoryOther: this.state.subCategoryOther,
            });
            this.props.nextStep();
            return true;
        }
        else {
            log.info("failed validation");
        }
        this.setState({errors: errors});
    },
    _handleCategoryChange(selection){
        this.setState({
            category: selection,
            subCategory: null
        })
        ReactGA.event({
            category: "ReadyRoost",
            action: "Category Set",
            label: selection
        });
    },
    _handleSubCategoryChange(selection){
        this.setState({subCategory: selection})
        ReactGA.event({
            category: "ReadyRoost",
            action: "SubCategory Set",
            label: selection
        });
    },
    _handleSubCategoryOtherChange(value){
        this.setState({subCategoryOther: value})
        ReactGA.event({
            category: "ReadyRoost",
            action: "SubCategoryOther Set",
            label: value
        });
    },
    render () {
        let {errors, company, category, subCategory, subCategoryOther} = this.state;
        const {department} = this.props
        let categoryOptions = department ? department.categories : []
        categoryOptions = categoryOptions.sort((cat1, cat2) => {
            return cat1.displayText.toUpperCase().localeCompare(cat2.displayText.toUpperCase())
        })
        let subCategories = category ? categoryOptions.find(cat => {
            return category.value === cat.value
        }).subCategories : []

        subCategories = subCategories.sort((subCat1, subCat2) => {
            return subCat1.displayText.toUpperCase().localeCompare(subCat2.displayText.toUpperCase())
        })

        let subCategoriesEnabled = subCategories && subCategories.length > 0

        let page =
        <div>
            <div>
                <FormInputGroup
                    fieldName="company"
                    label="Your Company"
                    errors={errors}
                    value={company}
                    required={true}
                    onChange={val => this.setState({"company": val})}
                    />

                <FormSelect
                    fieldName="category"
                    label="Category"
                    errors={errors}
                    value={category ? category.value : ""}
                    requred={true}
                    options={categoryOptions}
                    onChange={this._handleCategoryChange}
                    />

                <FormSelect
                    fieldName="subCategory"
                    display-if={subCategoriesEnabled}
                    label="Sub-Category"
                    errors={errors}
                    value={subCategory ? subCategory.value : ""}
                    requred={true}
                    options={subCategories}
                    onChange={this._handleSubCategoryChange}
                    />

                <FormInputGroup
                    fieldName="subCategoryOther"
                    display-if={subCategory && subCategory.value === "OTHER"}
                    label={null}
                    errors={errors}
                    value={subCategoryOther || ""}
                    required={true}
                    placeholder={"Please write in a sub-category"}
                    onChange={this._handleSubCategoryOtherChange}
                    />

            </div>
            <div className="actions">
                <button className="btn btn-outline-secondary" onClick={this.props.previousStep}>Previous Step</button>
                <button className="btn btn-primary" onClick={this.nextStep}>{this.props.nextText}</button>
            </div>
        </div>
        return page
    }
})

export default OpportunityDetail
