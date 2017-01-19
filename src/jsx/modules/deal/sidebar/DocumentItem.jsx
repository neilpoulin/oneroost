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
        let {externalLink} = doc
        if ( externalLink ){
            return <DocumentLinkItem doc={doc}/>
        }
        return <DocumentDownloadItem doc={doc}/>
    }
})

export default DocumentItem
