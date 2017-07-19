import React from "react"
import PropTypes from "prop-types"
import ModalButton from "ModalButton"
import TemplateForm from "account/TemplateForm"

const TemplateFormButton = React.createClass({
    propTypes: {
        btnClassName: PropTypes.string,
        department: PropTypes.string,
        buttonIcon: PropTypes.string,
        btnText: PropTypes.string,
        templateId: PropTypes.string,
        containerClassName: PropTypes.string,
    },
    getDefaultProps(){
        return {
            btnClassName: "btn-outline-primary",
            btnText: "Create a Template",
            department: "",
            buttonIcon: "plus",
            containerClassName: ""
        }
    },
    render () {
        const {btnClassName, department, btnText, buttonIcon, templateId, containerClassName} = this.props

        return (
            <ModalButton buttonText={btnText}
                buttonIcon={buttonIcon}
                containerClass={`CreateTemplateButton ${containerClassName}`}
                buttonClass={btnClassName}
                modalTitle="Create a Template"
                >
                <TemplateForm ref="addTemplateForm"
                    department={department}
                    templateId={templateId}
                    />
            </ModalButton>
        )
    }
})

export default TemplateFormButton
