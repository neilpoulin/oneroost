define(['parse', 'react', 'parse-react'], function(Parse, React, ParseReact){
    return React.createClass({
        getInitialState: function(){
            return {
                step: this.props.step,
                deal: this.props.deal,
                isComplete: this.props.step.completedDate != null,
                user: Parse.User.current()
            };
        },
        markAsDone: function(){
            var self = this;
            var step = this.props.step;
            this.setState( {"isComplete": true} );
            ParseReact.Mutation.Set( step, {"completedDate": new Date()} )
                .dispatch()
                .then(function(){
                    self.addStepStatusChangeComment( step );
                });
        },
        markAsNotDone: function(){
            var self = this;
            var step = this.props.step;
            this.setState( {"isComplete": false} )
            ParseReact.Mutation.Set( step, {"completedDate": null} )
                .dispatch()
                .then(function(){
                    self.addStepStatusChangeComment( step );
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
            var status = self.state.isComplete ? "Complete" : "Not Complete";

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

            if ( this.state.isComplete )
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
                <div className={"NextStepItemContainer " + ( this.state.isComplete ? 'complete' : '' )}>
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
});
