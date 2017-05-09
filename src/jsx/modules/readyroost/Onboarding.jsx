import React, { PropTypes } from "react"
import Introduction from "readyroost/Introduction"
import Registration from "readyroost/Registration"
import OpportunityDetail from "readyroost/OpportunityDetail"
import Confirmation from "readyroost/Confirmation"
import Parse from "parse"
import ReactGA from "react-ga"
import { withRouter, Link } from "react-router"
import * as RoostUtil from "RoostUtil"
import Progress from "readyroost/Progress"
import * as log from "LoggingUtil"

var fieldValues = {
    problem: "",
    company: "",
    currentUser: "",
    category: "",
    subCategory: "",
    subCategoryOther: "",
}

const Onboarding = withRouter(React.createClass({
    propTypes: {
        readyRoostUser: PropTypes.object.isRequired,
        currentUser: PropTypes.object,
        template: PropTypes.object.isRequired,
        createReadyRoost: PropTypes.func.isRequired,
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
        }).isRequired,
    },
    getInitialState(){
        return {
            step: 1,
            totalSteps: this.props.currentUser ? 2 : 4,
            error: null,
            loggedInSteps: this.props.currentUser ? true : false,
        }
    },
    saveValues: function(data) {
        fieldValues = Object.assign({}, fieldValues, data)
    },
    nextStep: function() {
        this.setState({
            step: this.state.step + 1
        })
    },
    previousStep: function() {
        this.setState({
            step: this.state.step - 1
        })
    },
    componentDidMount(){
        this.saveValues({currentUser: this.props.currentUser});
    },
    componentWillUpdate(nextProps){
        this.saveValues({currentUser: nextProps.currentUser});
    },
    showStep(){
        if (this.state.loggedInSteps){
            return this.getLoggedInStep()
        }
        return this.getAnonymousStep()
    },
    submit(){
        log.info("submitting the stuff", fieldValues);
        this.createReadyRoost();
    },
    createReadyRoost(){
        let self = this;
        const {template, department} = this.props;
        this.props.createReadyRoost()
        const departmentLabel = department.displayText
        // TODO: create a ready roost onboarding global state
        Parse.Cloud.run("createReadyRoost", {
            templateId: template.objectId,
            roostName: `${departmentLabel} | ${fieldValues.category.label}`,
            departmentCategory: fieldValues.category.value,
            departmentSubCategory: fieldValues.subCategory.value,
            departmentSubCategoryOther: fieldValues.subCategoryOther,
        }).then(function(result){
            log.info("created ready roost, so happy", result);
            ReactGA.set({ userId: fieldValues.currentUser.objectId || fieldValues.currentUser.id });
            ReactGA.event({
                category: "ReadyRoost",
                action: "Created ReadyRoost"
            });
            self.props.router.replace("/roosts/" + (result.roost.objectId || result.roost.id) + "/requirements");
        },
            function(error){
                log.error("can not create roost, already have one for this user", error);
                self.setState({
                    error: {
                        message: "You have already submitted an opportunity for to " + RoostUtil.getFullName(self.props.readyRoostUser) + ".",
                        link: error.message.link
                    }
                })
            })
    },
    getLoggedInStep(){
        switch (this.state.step) {
            case 1:
                return <Introduction nextStep={this.nextStep}
                    previousStep={this.previousStep}
                    readyRoostUser={this.props.readyRoostUser}
                    template={this.props.template}
                    />
            case 2:
                return <OpportunityDetail nextStep={this.submit}
                    previousStep={this.previousStep}
                    readyRoostUser={this.props.readyRoostUser}
                    fieldValues={fieldValues}
                    saveValues={this.saveValues}
                    template={this.props.template}
                    department={this.props.department}
                    nextText={"Submit"} />
            default:
                log.error("No step defined for LoggedInStep #" + this.state.step)
                break;
        }
    },
    getAnonymousStep(){
        switch (this.state.step) {
            case 1:
                return <Introduction nextStep={this.nextStep}
                previousStep={this.previousStep}
                readyRoostUser={this.props.readyRoostUser}
                template={this.props.template}
                />
            case 2:
                return <OpportunityDetail nextStep={this.nextStep}
                previousStep={this.previousStep}
                fieldValues={fieldValues}
                readyRoostUser={this.props.readyRoostUser}
                department={this.props.department}
                template={this.props.template}
                saveValues={this.saveValues} />
            case 3:
                return <Registration nextStep={this.nextStep}
                previousStep={this.previousStep}
                readyRoostUser={this.props.readyRoostUser}
                saveValues={this.saveValues}
                currentUser={this.props.currentUser}
                company={fieldValues.company} />
            case 4:
                return <Confirmation submit={this.submit}
                previousStep={this.previousStep}
                readyRoostUser={this.props.readyRoostUser}
                tempalte={this.props.template}
                />
            default:
                log.error("No step defined for AnonymousStep #" + this.state.step)
                break
        }
    },
    getLabels(){
        if (this.props.currentUser){
            return ["Welcome", "Submit"]
        }
        return ["Welcome", "Opportunity", "Login", "Submit"];
    },
    render () {
        var alert = null;
        if (this.state.error){
            let link = null
            if (this.state.error.link){
                link = <Link className={"alert-link"} tag="a" to={this.state.error.link}>View the Opportunity</Link>
            }
            alert =
            <div className="alert alert-warning">
                {this.state.error.message} &nbsp;
                {link}
            </div>
        }

        let page =
        <div className="Onboarding">
            <Progress totalSteps={this.state.totalSteps} step={this.state.step} labels={this.getLabels()}/>
            {alert}
            {this.showStep()}
        </div>
        return page
    }
}))

export default Onboarding
