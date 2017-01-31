import React, { PropTypes } from "react"
import Parse from "parse"
import moment from "moment"
import Select from "react-select"
import Stages from "Stages"
import FormGroup from "FormGroup"
import RoostUtil from "RoostUtil"

const TimelineForm = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired,
        updateDeal: PropTypes.func.isRequired,
    },
    getInitialState(){
        return {
            timeline: moment(this.props.deal.timeline),
            stage: this.props.deal.currentStage || "EXPLORE",
            saveSuccess: false,
            saveError: false,
            errors: {},
        };
    },
    handleChange: function (date) {
        this.setState({
            timeline: date
        });
    },
    handleStageChange(value){
        console.log("handle stage change");
        this.setState({
            stage: value
        });
    },
    doSubmit(){
        let {deal} = this.props
        var user = Parse.User.current()
        let profile = deal.profile
        profile.timeline = this.state.timeline.format()
        var message = RoostUtil.getFullName(user) + " updated the Timeline";
        let data = {
            profile: profile,
            currentStage: this.state.stage.value,
            stageUpdatedAt: new Date()
        }
        this.props.updateDeal(data, message)
        this.showSuccess();
    },
    formatDurationAsDays( past ){
        var numDays = Math.floor( moment.duration( moment().diff(past)).asDays() );
        var formatted = numDays + " days ago";

        if ( numDays <= 1 ){
            formatted = "today";
        }

        return formatted;
    },
    showSuccess(){
        var self = this;
        self.setState({saveSuccess: true});
        setTimeout(function(){
            self.setState({saveSuccess: false});
        }, 2000);
    },
    getFormattedAge(){
        var {deal} = this.props;
        var created = deal.createdAt;
        return this.formatDurationAsDays( created );
    },
    formatDate( date ){
        var formatted = moment(date).format("MMM D, YYYY");
        return formatted;
    },
    getFormattedCreatedDate(){
        var {deal} = this.props;
        var created = deal.createdAt;
        return this.formatDate(created);
    },
    getStageValues(){
        var values = [];
        Stages.forEach(function (value, key, stages){
            if ( value.visible ){
                values.push( {
                    value: key,
                    label: value.label
                });
            }
        });

        return values;
    },
    render(){
        let {errors} = this.state;
        var {deal} = this.props;
        var age = this.getFormattedAge();
        var stages = this.getStageValues();
        var created = this.getFormattedCreatedDate();
        var stageUpdated = deal.stageUpdatedAt || deal.createdAt;
        var stageUpdatedFormatted = this.formatDate( stageUpdated );
        var stageUpdatedAge = this.formatDurationAsDays( stageUpdated );
        var saveMessage = null;
        var saveClass = null
        if ( this.state.saveSuccess ){
            saveMessage = <div className="help-block">Success <i className="fa fa-check"></i></div>
            saveClass = "has-success";
        }

        return (
            <div className="TimelineForm">
                <FormGroup
                    label="Opportunity Created"
                    fieldName="created"
                    errors={errors}
                    >
                    <div>
                        <span className="opportunityAge">{age}</span> on <span className="createdDate">{created}</span>
                    </div>
                </FormGroup>

                <FormGroup
                    label="Current Stage"
                    errors={errors}
                    fieldName="stage"
                    >
                    <Select
                        name="deal-stage"
                        options={stages}
                        value={this.state.stage}
                        onChange={this.handleStageChange}
                        clearable={false}
                        />
                    <p className="help-block">
                        Last updated {stageUpdatedAge} on <span className="stageUpdatedDate">{stageUpdatedFormatted}</span>
                    </p>
                </FormGroup>

                <div className={saveClass}>
                    <button className="btn btn-outline-primary btn-block" onClick={this.doSubmit}>Save</button>
                    {saveMessage}
                </div>

            </div>
        )
    }
});

export default TimelineForm
