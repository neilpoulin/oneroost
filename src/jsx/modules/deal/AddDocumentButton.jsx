import React from "react"
import PropTypes from "prop-types"
import ModalButton from "ModalButton"
import DocumentUploadForm from "DocumentUploadForm"

const AddDocumentButton = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired,
        btnClassName: PropTypes.string
    },
    getDefaultProps(){
        return {
            btnClassName: "btn-outline-primary"
        }
    },
    render () {
        let {deal, btnClassName} = this.props;
        var button =
        <ModalButton
            buttonText=" Add a Document"
            buttonIcon="plus"
            containerClass="AddDocumentButton"
            buttonClass={btnClassName}
            modalTitle="Add a Document"
            >
            <DocumentUploadForm
                ref="addDocumentForm"
                deal={deal} />
        </ModalButton>

        return button;
    }
})

export default AddDocumentButton
