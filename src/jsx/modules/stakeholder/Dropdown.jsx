import React, { PropTypes } from "react"
import Select from "react-select"
import RoostUtil from "RoostUtil"

const Dropdown = React.createClass({
    propTypes: {
        stakeholders: PropTypes.array.isRequired
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
            value: null,
            stakeholders: [],
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
        options = this.props.stakeholders.map(function (stakeholder) {
            return {
                value: stakeholder.get("user").id,
                label: RoostUtil.getFullName(stakeholder.get("user"))
            }
        });
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
