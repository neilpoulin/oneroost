import React, { PropTypes } from "react"
import Parse from "parse"
import DocumentDownloadItem from "sidebar/DocumentDownloadItem"
import DocumentLinkItem from "sidebar/DocumentLinkItem"

const DocumentItem = React.createClass({
    propTypes: {
        doc: PropTypes.instanceOf(Parse.Object).isRequired
    },
    render () {
        var {doc} = this.props;

        if ( doc.get("externalLink") ){
            return <DocumentLinkItem doc={doc}/>
        }
        return <DocumentDownloadItem doc={doc}/>
    }
})

export default DocumentItem
