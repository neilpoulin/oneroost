import React, { PropTypes } from 'react'
import AccountModal from './AccountModal';

const AddAccountButton = React.createClass({
    openModal: function(){
        this.refs.modal.openModal();
    },
    render () {
        var btnClass = this.props.btnClassName || 'btn-outline-success';
        return (
            <div className="AddAccountButton">
                <button className={"btn " + btnClass}  onClick={this.openModal}>
                     {this.props.children || "Create Account"}
                </button>
                <AccountModal ref="modal"/>
            </div>
        )
    }
})

export default AddAccountButton
