import React from "react"
import PropTypes from "prop-types"
import {Link} from "react-router"
import TemplateFormButton from "account/TemplateFormButton"

const DepartmentCard = React.createClass({
    propTypes: {
        department: PropTypes.shape({
            displayText: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            template: PropTypes.shape({
                objectId: PropTypes.string.isRequired,
                title: PropTypes.string,
                description: PropTypes.string,
                department: PropTypes.string,
                departmentCategory: PropTypes.string,
                ownedBy: PropTypes.shape({
                    objectId: PropTypes.string.isRequired,
                    firstName: PropTypes.string,
                    lastName: PropTypes.string,
                })
            }),
            categories: PropTypes.arrayOf(PropTypes.shape({
                displayText: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
                subCategories: PropTypes.arrayOf(PropTypes.shape({
                    displayText: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired,
                }))
            })).isRequired,
        }).isRequired
    },
    render () {
        const {department} = this.props
        const {displayText, template, value} = department
        const {objectId: templateId, ownedBy, requirements, description} = template || {}
        return (
            <div className="DepartmentCard">
                <div className="title">{displayText}</div>
                <div className={`actions ${!template ? "center" : ""}`}>
                    <TemplateFormButton
                        display-if={template}
                        templateId={templateId}
                        department={value}
                        buttonIcon={""}
                        containerClassName={"action"}
                        btnClassName="btn-block btn-outline-secondary"
                        btnText={"Edit Template"}/>

                    <TemplateFormButton
                        display-if={!template}
                        department={value}
                        buttonIcon={"plus"}
                        containerClassName={"action"}
                        btnClassName="btn-outline-primary btn-block"
                        btnText={"Add Template"}/>
                </div>
                <div className="details" display-if={template}>
                    <div className="templateInfo" >
                        <div className="field">
                            <label>Owner:</label>
                            <div className="owner">
                                {`${ownedBy.firstName} ${ownedBy.lastName}`}
                            </div>
                        </div>
                        <div className="field" display-if={description}>
                            <label>Description:</label>
                            <div className="">
                                {description}
                            </div>
                        </div>
                        <div className="field" display-if={requirements}>
                            <label>Requirements:</label>
                            <div className="">
                                {requirements.length}
                            </div>
                        </div>
                        <div className="field">
                            <label>Link to Share:</label>
                            <div className="shareLink">
                                <Link className="link" to={`/proposals/${templateId}`}>
                                    {`${window.location.origin}/proposals/${templateId}`}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default DepartmentCard
