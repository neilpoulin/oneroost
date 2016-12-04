import React, { PropTypes } from "react"
import DocumentDownloadItem from "./DocumentDownloadItem"
import DocumentLinkItem from "./DocumentLinkItem"

const DocumentItem = React.createClass({
    propTypes: {
        doc: PropTypes.object.isRequired
    },
    render () {
        var doc = this.props.doc;

        if ( doc.externalLink ){
            return <DocumentLinkItem doc={doc}/>
        }
        return <DocumentDownloadItem doc={doc}/>
    }
})

export default DocumentItem
