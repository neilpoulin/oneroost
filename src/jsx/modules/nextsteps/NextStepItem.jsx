import Parse from 'parse';
import React from 'react';
import ParseReact from 'parse-react';

export default React.createClass({
    getInitialState: function(){
        return {
            deal: this.props.deal,
            user: Parse.User.current()
        };
    },
    markAsDone: function(){
        var self = this;
        var step = this.props.step;
        ParseReact.Mutation.Set( step, {"completedDate": new Date()} )
        .dispatch()
        .then(function( step ){
            self.addStepStatusChangeComment( step );
            self.setState({step: step});
        });
    },
    markAsNotDone: function(){
        var self = this;
        var step = this.props.step;
        ParseReact.Mutation.Set( step, {"completedDate": null} )
        .dispatch()
        .then(function( step ){
            self.addStepStatusChangeComment( step );
            self.setState({step: step});
        });
    },
    doDelete(){
        var self = this;
        var step = self.props.step;

        if ( !confirm( "Are you sure you want to delete next step: " + step.title + "?" ) )
        {
            return;
        }

        ParseReact.Mutation.Destroy( step ).dispatch().then(function(){
            self.addStepDeletedComment( step );
        });
    },
    addStepStatusChangeComment: function( step ){
        var self = this;
        var status = self.props.step.completedDate != null ? "Complete" : "Not Complete";

        var message =  self.state.user.get("username") + " marked " + step.title + " as \"" + status + "\".";

        var comment = {
            deal: self.state.deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
        };
        ParseReact.Mutation.Create('DealComment', comment).dispatch();
    },
    addStepDeletedComment: function( step ){
        var self = this;
        var message = self.state.user.get("username") + " deleted Next Step: " + step.title;
        var comment = {
            deal: self.state.deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
        };
        ParseReact.Mutation.Create('DealComment', comment).dispatch();
    },
    formatDate: function( date )
    {
        if ( ! (date instanceof Date) )
        {
            date = new Date( date );
        }

        return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
    },
    render: function(){
        var doneButton = (
            <button className="btn btn-sm btn-success btn-block"
                onClick={this.markAsDone} >
                Done <i className="fa fa-check"></i>
        </button>
    );

    var dateLabel = "Due Date:"
    var date = this.props.step.dueDate;
    if ( this.props.step.completedDate != null )
    {
        doneButton = (
            <button className="btn btn-sm btn-default btn-block"
                onClick={this.markAsNotDone} >
                Not Done <i className="fa fa-times"></i>
        </button>
    );

    dateLabel = "Completed Date: ";
    date = this.props.step.completedDate;
}

return (
    <div className={"NextStepItemContainer " + ( this.props.step.completedDate != null ? 'complete' : '' )}>
        <div className="nextStepTitle">{this.props.step.title}</div>
        <div className="nextStepDescription">{this.props.step.description}</div>
        <div className="nextStepDueDate">
            {dateLabel} {this.formatDate(date)}
        </div>
        <div className="editButtons">
            {doneButton}
            <button className="btn btn-sm btn-danger btn-block"
                onClick={this.doDelete} >
                Delete <i className="fa fa-trash"></i>
        </button>
    </div>
</div>
);
}
});
