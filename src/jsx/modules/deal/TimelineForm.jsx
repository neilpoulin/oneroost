import React, { PropTypes } from "react"
import Parse from "parse"
import ParseReact from "parse-react"
import moment from "moment"
import Select from "react-select"
import Stages from "./Stages"

const TimelineForm = React.createClass({
    mixins: [ParseReact.Mixin],
    observe(){
        return {};
    },
    propTypes: {
        timeline: PropTypes.string
    },
    getInitialState(){
        return {
            timeline: moment(this.props.timeline),
            stage: this.props.deal.currentStage || "EXPLORE"
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
        var deal = this.props.deal;
        deal.profile.timeline = this.state.timeline.format();

        var setter = ParseReact.Mutation.Set(deal, {
            profile: deal.profile,
            currentStage: this.state.stage.value,
            stageUpdatedAt: new Date()
        });
        setter.dispatch().then(this.sendComment);
    },
    sendComment( deal )
    {
        var user = Parse.User.current();
        var message = user.get("firstName") + " " + user.get("lastName") + " updated the Timeline";
        var comment = {
            deal: deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
            navLink: {type: "timeline"}
        };
        ParseReact.Mutation.Create("DealComment", comment).dispatch();
    },
    formatDurationAsDays( past ){
        var numDays = Math.floor( moment.duration( moment().diff(past)).asDays() );
        var formatted = numDays + " days ago";

        if ( numDays <= 1 ){
            formatted = "today";
        }

        return formatted;
    },
    getFormattedAge(){
        var deal = this.props.deal;
        var created = deal.createdAt;
        return this.formatDurationAsDays( created );
    },
    formatDate( date ){
        var formatted = moment(date).format("MMM D, YYYY");
        return formatted;
    },
    getFormattedCreatedDate(){
        var deal = this.props.deal;
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
        var deal = this.props.deal;
        var age = this.getFormattedAge();
        var stages = this.getStageValues();
        var created = this.getFormattedCreatedDate();
        var stageUpdated = deal.stageUpdatedAt || deal.createdAt;
        var stageUpdatedFormatted = this.formatDate( stageUpdated );
        var stageUpdatedAge = this.formatDurationAsDays( stageUpdated );
        return (
            <div className="TimelineForm">
                <div className="form-group">
                    <label>Opportunity Created</label>
                    <div>
                        <span className="opportunityAge">{age}</span> on <span className="createdDate">{created}</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Current Stage</label>
                    <Select
                        name="deal-stage"
                        options={stages}
                        value={this.state.stage}
                        onChange={this.handleStageChange}
                        clearable={false}
                        />
                    <p className="help-block">Last updated {stageUpdatedAge} on <span className="stageUpdatedDate">{stageUpdatedFormatted}</span></p>
                </div>
                <button className="btn btn-outline-primary btn-block" onClick={this.doSubmit}>Save</button>
            </div>
        )
    }
});

export default TimelineForm
