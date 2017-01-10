import React, { PropTypes } from "react"
import Parse from "parse"
import DocumentItem from "sidebar/DocumentItem"
import AddDocumentButton from "AddDocumentButton"

const DocumentsSidebar = React.createClass({
    propTypes: {
        documents: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)),
        deal: PropTypes.instanceOf(Parse.Object)
    },
    getInitialState: function(){
        return {
            uploading: false,
            percent: 0,
            dragover: false
        }
    },
    getDefaultProps(){
        return {
            documents: [],
        }
    },
    render () {
        let {documents, deal} = this.props;
        var documentItems =
        <div className="documentContainer">
            {documents.map(function(doc){
                return <DocumentItem
                        key={"deal_" + deal.id + "_doc_" + doc.id}
                        doc={doc} />
            })}
        </div>

        var sidebar =
        <div className="DocumentsSidebar">
            <h3 className="title">Documents</h3>
            <AddDocumentButton deal={deal} buttonClassName={"btn-outline-primary"}/>
            {documentItems}
        </div>;

        return sidebar;
    }
});

export default DocumentsSidebar;
