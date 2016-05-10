import React, { PropTypes } from "react"
import ParseReact from "parse-react"

const NextStepDeleteButton = React.createClass({
    propTypes: {
        step: PropTypes.object.isRequired,
        afterDelete: PropTypes.func.isRequired
    },
    handleDelete(){
        this.props.afterDelete() ;
        ParseReact.Mutation.Destroy( this.props.step )
        .dispatch();
    },
    render () {
        var button =
        <button className="btn btn-outline-danger" onClick={this.handleDelete}>
            <i className="fa fa-trash">
            </i>
            Delete
        </button>;
        return button;
    }
})

export default NextStepDeleteButton
