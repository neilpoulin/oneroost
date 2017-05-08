import React, { PropTypes } from "react"
import {Link} from "react-router"
import CreateTemplateButton from "account/CreateTemplateButton"

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
        const {objectId: templateId, title} = template || {}
        return (
            <div className="DepartmentCard">
                <div className="title">{displayText}</div>
                <div className="details">
                    <Link display-if={template} className="link" to={`/proposals/${templateId}`}>
                        {`View ${title}`}
                    </Link>
                </div>
                <div className="actions" display-if={!template}>
                    <CreateTemplateButton department={value}
                        btnClassName="btn-outline-primary btn-block"
                        btnText={"Add Template"}/>
                </div>
            </div>
        )
    }
})

export default DepartmentCard
