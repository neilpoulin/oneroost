import React, { PropTypes } from "react"

const RequirementsInfo = React.createClass({
    propTypes: {
        message: PropTypes.string,
        messageClassName: PropTypes.string,
        displayNumbered: PropTypes.bool,
        template: PropTypes.shape({
            requirements: PropTypes.arrayOf(PropTypes.shape({
                title: PropTypes.string.isRequired,
                description: PropTypes.string,
            })),
            requirementsDisplay: PropTypes.arrayOf(PropTypes.oneOf(["LIST", "MESSAGE"]))
        }).isRequired,
        forceList: PropTypes.bool,
        forceMessage: PropTypes.bool,
        editable: PropTypes.bool,
    },
    getDefaultProps(){
        return {
            messageClassName: "",
            displayNumbered: false,
            forceList: false,
            forceMessage: false,
            editable: false,
        }
    },
    render () {
        const {template, message, messageClassName, displayNumbered, forceList, forceMessage} = this.props
        const {requirements, requirementsDisplay} = template
        let messageDisplay = null
        let list = null;
        if (message && (requirementsDisplay.indexOf("MESSAGE") !== -1 || forceMessage )){
            messageDisplay = <p className={`message ${messageClassName}`}>{message}</p>
        }
        if ( requirementsDisplay.indexOf("LIST") !== -1 || forceList){
            if ( !requirements ){
                list = <div className="emptyState">There are no requirements</div>
            }
            else {
                list = <ol className={`requirementsList list-unstyled numbered-${displayNumbered}`} >
                    {requirements.map((req, i) => {
                        return <li key={"requirement_info_" + i} className="requirement">
                            <div className="title">{req.title}</div>
                            <div className="description">{req.description}</div>
                        </li>
                    })}
                </ol>
            }
        }

        return (
            <div className="RequirementsInfo">
                {messageDisplay}
                {list}
            </div>
        )
    }
})

export default RequirementsInfo
