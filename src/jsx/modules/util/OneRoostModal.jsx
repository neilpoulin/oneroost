import React, { PropTypes } from "react"
import Modal from "react-bootstrap-modal";

const OneRoostModal = React.createClass({
    propTypes: {
        title: PropTypes.string.isRequired,
        show: PropTypes.bool,
        saveText: PropTypes.string,
        cancelText: PropTypes.string
    },
    getInitialState: function(){
        return {
            open: this.props.show,
            errors: {}
        }
    },
    getDefaultProps: function() {
        return {
            saveText: "Save",
            cancelText: "Cancel",
            show: false
        };
    },
    closeModal: function(){
        this.setState({
            open: false
        });
        this.clearForm();
    },
    clearForm: function(){
        this.refs.form.setState( this.refs.form.getInitialState() );
    },
    submit: function(){
        var success = this.refs.form.doSubmit();
        //check if the save was successful and we should close the form
        console.log("submitting form resulted in ", success);
        if ( typeof success === "boolean" )
        {
            return success;
        }
        else{
            //no success was returned, so defaulting to true
            console.warn("No doSubmit success value was returned, defaulting to true");
            return true;
        }
    },
    openModal: function(){
        this.setState({
            open: true
        });
    },
    saveAndClose: function(){
        if ( this.submit() ){
            this.closeModal();
        }
    },
    render () {
        var form = React.cloneElement(React.Children.only(this.props.children), {
            ref: "form"
        });

        return (
            <Modal
                show={this.state.open}
                onHide={this.closeModal}
                aria-labelledby="ModalHeader"
                backdrop="static"
                >
                <Modal.Header closeButton>
                    <Modal.Title id="ModalHeader">{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {form}
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Dismiss className="btn btn-default">{this.props.cancelText}</Modal.Dismiss>
                    <button className="btn btn-primary" onClick={this.saveAndClose}>
                        {this.props.saveText}
                    </button>
                </Modal.Footer>
            </Modal>
        )
    }
})

export default OneRoostModal
