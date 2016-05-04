import React, { PropTypes } from "react"
import Modal from "react-bootstrap-modal";

const OneRoostModal = React.createClass({
    propTypes: {
        onSave: PropTypes.func,
        title: PropTypes.string.isRequired,
        show: PropTypes.bool
    },
    getInitialState: function(){
        return {
            open: this.props.show
        }
    },
    getDefaultProps: function() {
        return {
            onSave: function(){console.log("no success function passed");},
            saveText: "Save",
            cancelText: "Cancel",
            clearForm: function(){console.log("no clearForm callback provided");},
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
        this.refs.form.doSubmit();
    },
    openModal: function(){
        this.setState({
            open: true
        });
    },
    saveAndClose: function(){
        this.submit();
        this.closeModal();
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
