import React, { PropTypes } from "react"
import Introduction from "readyroost/Introduction"
import Registration from "readyroost/Registration"
import OpportunityDetail from "readyroost/OpportunityDetail"
import Confirmation from "readyroost/Confirmation"
import Parse from "parse"
import ReactGA from "react-ga"
import { withRouter, Link } from "react-router"
import RoostUtil from "RoostUtil"
import Progress from "readyroost/Progress"

var fieldValues = {
    problem: "",
    company: "",
    currentUser: ""
}

const Onboarding = withRouter( React.createClass({
    propTypes: {
        readyRoostUser: PropTypes.object.isRequired,
        currentUser: PropTypes.object
    },
    getInitialState(){
        return {
            step: 1,
            totalSteps: this.props.currentUser ? 2 : 4,
            error: null
        }
    },
    saveValues: function(data) {
        fieldValues = Object.assign({}, fieldValues, data)
    },
    nextStep: function() {
        this.setState({
            step : this.state.step + 1
        })
    },
    previousStep: function() {
        this.setState({
            step : this.state.step - 1
        })
    },
    componentDidMount(){
        this.saveValues({currentUser: this.props.currentUser});
    },
    showStep(){
        if ( this.props.currentUser ){
            return this.getLoggedInStep()
        }
        return this.getAnonymousStep()
    },
    submit(){
        console.log("submitting the stuff", fieldValues);
        this.createReadyRoost();
    },
    createReadyRoost(){
        var profileUserId = this.props.readyRoostUser.id
        var self = this;
        Parse.Cloud.run("createReadyRoost", {
            profileUserId: profileUserId,
            roostName: fieldValues.problem
        }).then(function(result){
            console.log("created ready roost, so happy", result);
            ReactGA.set({ userId: fieldValues.currentUser.objectId || fieldValues.currentUser.id });
            ReactGA.event({
                  category: "ReadyRoost",
                  action: "Created ReadyRoost"
                });
            self.props.router.replace("/roosts/" + (result.roost.objectId || result.roost.id));
        },
        function(error){
            console.error("can not create roost, already have one for this user", error);
            self.setState({
                error: {
                    message: "You have already submitted an opportunity for to " + RoostUtil.getFullName( self.props.readyRoostUser ) + ".",
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
                />
            case 2:
            return <OpportunityDetail nextStep={this.submit}
                previousStep={this.previousStep}
                readyRoostUser={this.props.readyRoostUser}
                fieldValues={fieldValues}
                saveValues={this.saveValues}
                nextText={"Submit"} />
        }
    },
    getAnonymousStep(){
        switch (this.state.step) {
            case 1:
            return <Introduction nextStep={this.nextStep}
                previousStep={this.previousStep}
                readyRoostUser={this.props.readyRoostUser}
                />
            case 2:
            return <OpportunityDetail nextStep={this.nextStep}
                previousStep={this.previousStep}
                fieldValues={fieldValues}
                readyRoostUser={this.props.readyRoostUser}
                saveValues={this.saveValues} />
            case 3:
            return <Registration nextStep={this.nextStep}
                previousStep={this.previousStep}
                readyRoostUser={this.props.readyRoostUser}
                saveValues={this.saveValues}
                currentUser={fieldValues.currentUser}
                company={fieldValues.company} />
            case 4:
            return <Confirmation submit={this.submit}
                previousStep={this.previousStep}
                readyRoostUser={this.props.readyRoostUser}
                />
        }
    },
    getLabels(){
        if ( this.props.currentUser ){
            return ["Welcome", "Submit"]
        }
        return ["Welcome", "Opportunity", "Login", "Submit"];
    },
    render () {
        var alert = null;
        if ( this.state.error ){
            let link = null
            if ( this.state.error.link ){
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
}) )

export default Onboarding
