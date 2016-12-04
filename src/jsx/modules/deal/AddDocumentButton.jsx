import React, { PropTypes } from "react"
import ModalButton from "./../util/ModalButton"
import DocumentUploadForm from "./DocumentUploadForm"

const AddDocumentButton = React.createClass({
    propTypes: {
        deal: PropTypes.shape({
            objectId: PropTypes.string.isRequired
        }),
        btnClassName: PropTypes.string
    },
    getDefaultProps(){
        return {
            btnClassName: "btn-outline-primary"
        }
    },
    render () {
        var button =
        <ModalButton
            buttonText=" Add a Document"
            buttonIcon="plus"
            containerClass="AddDocumentButton"
            buttonClass={this.props.btnClassName}
            modalTitle="Add a Document"
            >
            <DocumentUploadForm
                ref="addDocumentForm"
                deal={this.props.deal} />
        </ModalButton>

        return button;
    }
})

export default AddDocumentButton
