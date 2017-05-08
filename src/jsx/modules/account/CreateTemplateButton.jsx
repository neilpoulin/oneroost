import React, { PropTypes } from "react"
import ModalButton from "ModalButton"
import CreateTemplateForm from "account/CreateTemplateForm"

const CreateTemplateButton = React.createClass({
    propTypes: {
        btnClassName: PropTypes.string,
        department: PropTypes.string,
        btnText: PropTypes.string,
    },
    getDefaultProps(){
        return {
            btnClassName: "btn-outline-primary",
            btnText: "Create a Template",
            department: ""
        }
    },
    render () {
        const {btnClassName, department, btnText} = this.props

        return (
            <ModalButton buttonText={btnText}
                buttonIcon="plus"
                containerClass="CreateTemplateButton"
                buttonClass={btnClassName}
                modalTitle="Create a Template"
                >
                <CreateTemplateForm ref="addTemplateForm"
                    department={department}
                    />
            </ModalButton>
        )
    }
})

export default CreateTemplateButton
