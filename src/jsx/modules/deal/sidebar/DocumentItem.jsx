import React from "react"
import PropTypes from "prop-types"
import DocumentDownloadItem from "sidebar/DocumentDownloadItem"
import DocumentLinkItem from "sidebar/DocumentLinkItem"

const DocumentItem = React.createClass({
    propTypes: {
        doc: PropTypes.object.isRequired
    },
    render () {
        var {doc} = this.props;
        let {externalLink} = doc
        if ( externalLink ){
            return <DocumentLinkItem doc={doc}/>
        }
        return <DocumentDownloadItem doc={doc}/>
    }
})

export default DocumentItem
