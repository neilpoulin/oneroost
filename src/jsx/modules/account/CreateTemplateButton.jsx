import React, { PropTypes } from "react"
import ModalButton from "ModalButton"
import CreateTemplateForm from "account/CreateTemplateForm"

const CreateTemplateButton = React.createClass({
    propTypes: {
        btnClassName: PropTypes.string,
    },
    getDefaultProps(){
        return {
            btnClassName: "btn-outline-primary"
        }
    },
    render () {
        const {btnClassName} = this.props

        return (
            <ModalButton buttonText="Create a Template"
                buttonIcon="plus"
                containerClass="CreateTemplateButton"
                buttonClass={btnClassName}
                modalTitle="Create a Template"
                >
                <CreateTemplateForm ref="addTemplateForm"/>
            </ModalButton>
        )
    }
})

export default CreateTemplateButton
