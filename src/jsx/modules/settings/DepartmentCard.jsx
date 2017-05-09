import React, { PropTypes } from "react"
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
        const {objectId: templateId} = template || {}
        return (
            <div className="DepartmentCard">
                <div className="title">{displayText}</div>
                <div className="details">
                    <div className="field" display-if={template}>
                        <label>Share Link:</label>
                        <div className="shareLink">
                            <Link className="link" to={`/proposals/${templateId}`}>
                                {`${window.location.origin}/proposals/${templateId}`}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="actions">
                    <TemplateFormButton
                        display-if={template}
                        templateId={templateId}
                        department={value}
                        buttonIcon={""}
                        btnClassName="btn-block btn-outline-secondary"
                        btnText={"Edit Template"}/>

                    <TemplateFormButton
                        display-if={!template}
                        department={value}
                        buttonIcon={"plus"}
                        btnClassName="btn-outline-primary btn-block"
                        btnText={"Add Template"}/>
                </div>
            </div>
        )
    }
})

export default DepartmentCard
