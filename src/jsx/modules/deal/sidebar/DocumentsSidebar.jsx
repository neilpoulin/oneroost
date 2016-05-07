import React, { PropTypes } from "react"

const DocumentsSidebar = React.createClass({
    propTypes: function(){
        params: PropTypes.shape({
            dealId: PropTypes.any.isRequired
        })
    },
    render () {
        var sidebar =
        <div className="NextStepSidebar">
            <h3 className="title">Documents</h3>
            <p className="lead">Coming soon...</p>
        </div>;

        return sidebar;
    }
})

export default DocumentsSidebar
