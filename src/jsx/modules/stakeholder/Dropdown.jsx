import React, { PropTypes } from "react"
import ParseReact from "parse-react";
import Parse from "parse";
import Select from "react-select";

const Dropdown = React.createClass({
    mixins: [ ParseReact.Mixin],
    propTypes: {
        deal: PropTypes.object.isRequired
    },
    observe: function () {
        var stakeholderQuery = new Parse.Query("Stakeholder");
        stakeholderQuery.include("user");
        stakeholderQuery.include("invitedBy");
        stakeholderQuery.ascending("role");
        stakeholderQuery.equalTo("deal", this.props.deal);
        return {
            stakeholders: stakeholderQuery
        }
    },
    getInitialState(){
        return {
            value: this.props.value
        };
    },
    getDefaultProps(){
        return {
            handleChange: function () {
                console.error("You did not implement a change handler for the stakeholder dropdown")
            },
            value: null
        }
    },
    handleChange(val){
        this.props.handleChange(val);
        this.setState({
            value: val
        })
    },
    render(){
        var options = [];
        if (this.pendingQueries().length == 0) {
            options = this.data.stakeholders.map(function (stakeholder) {
                return {value: stakeholder.user.objectId, label: stakeholder.user.firstName + " " + stakeholder.user.lastName}
            });
        }
        return (
            <Select
                name="form-field-name"
                options={options}
                value={this.state.value}
                onChange={this.handleChange}
                />
        )
    }
});

export default Dropdown
