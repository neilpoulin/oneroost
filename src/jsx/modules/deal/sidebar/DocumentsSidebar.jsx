import React, { PropTypes } from "react"
import Parse from "parse"
import ParseReact from "parse-react"
import DocumentItem from "sidebar/DocumentItem"
import AddDocumentButton from "AddDocumentButton"

const DocumentsSidebar = React.createClass({
    mixins: [ParseReact.Mixin],
    propTypes: {
        params: PropTypes.shape({
            dealId: PropTypes.any.isRequired
        }),
        deal: PropTypes.object
    },
    getInitialState: function(){
        return {
            uploading: false,
            percent: 0,
            dragover: false
        }
    },
    observe: function(props, state){
        return {
            documents: (new Parse.Query("Document")).include("createdBy").equalTo( "deal", props.deal ).descending("createdAt")
        }
    },
    render () {
        var self = this;
        var dealId = self.props.params.dealId;
        var documents = null;
        if ( this.pendingQueries().length > 0 ){
            documents = <div><i className="fa fa-spinner fa-spin"></i> Loading documents</div>
        }
        else{
            documents =
            <div className="documentContainer">
                {this.data.documents.map(function(doc){
                    return <DocumentItem
                            key={"deal_" + dealId + "_doc_" + doc.objectId}
                            doc={doc}
                         />
                })}
            </div>
        }

        var sidebar =
        <div className="DocumentsSidebar">
            <h3 className="title">Documents</h3>
            <AddDocumentButton deal={this.props.deal} buttonClassName={"btn-outline-primary"}/>
            {documents}
        </div>;

        return sidebar;
    }
});

export default DocumentsSidebar;
