import React, { PropTypes } from "react"
import Select from "react-select"
import RoostUtil from "RoostUtil"
import {connect} from "react-redux"
import {denormalize} from "normalizr"
import * as Stakeholder from "models/Stakeholder"

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
                value: stakeholder.user.objectId,
                label: RoostUtil.getFullName(stakeholder.user)
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

const mapStateToProps = (state, ownProps) => {
    let dealId = ownProps.deal.objectId
    let roost = state.roosts.get(dealId).toJS()
    let stakeholderIds = roost.stakeholders.ids;

    let stakeholders = denormalize (stakeholderIds, [Stakeholder.Schema], state.entities.toJS())

    return {
        stakeholders,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown)
