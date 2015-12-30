define(['parse', 'react'], function(Parse, React){
    return React.createClass({
        getInitialState: function(){
            return {
                step: this.props.step,
                isComplete: this.props.step.completedDate != null
            };
        },
        markAsDone: function(){
            var component = this;
            var step = this.props.step;
            var query = new Parse.Query("NextStep")
                .equalTo("objectId", step.objectId)
                .first({
                    success: function( step ){
                        step.set( "completedDate", new Date() );
                        step.save(null, {
                            success: function( step ){
                                console.log("successfully marked next step as done.");
                                component.setState({"isComplete": true});
                                component.render();
                            },
                            error: function(){
                                console.error("failed to update next step when marking it as done.");
                            }
                        });
                    },
                    error: function(){
                        console.log("failed to retrieve next step from Parse.");
                    }
            });
        },
        markAsNotDone: function(){
            var component = this;
            var step = this.props.step;
            var query = new Parse.Query("NextStep")
                .equalTo("objectId", step.objectId)
                .first({
                    success: function( step ){
                        step.set( "completedDate", null );
                        step.save(null, {
                            success: function( step ){
                                console.log("successfully marked next step as NOT done.");
                                component.setState({"isComplete": false});
                                component.render();
                            },
                            error: function(){
                                console.error("failed to update next step when marking it as NOT done.");
                            }
                        });
                    },
                    error: function(){
                        console.log("failed to retrieve next step from Parse.");
                    }
            });
        },
        doDelete(){
            var step = this.props.step;

            var c = confirm( "Are you sure you want to delete next step: " + step.title + "?" );
            if ( !c )
            {
                return;
            }

            var component = this;
            var query = new Parse.Query("NextStep")
                .equalTo("objectId", step.objectId)
                .first({
                    success: function( obj ){
                        obj.destroy({
                            success: function(){
                                console.log("successfully deleted the next step");
                                component.props.deleteNextStep();
                            }
                        });
                    },
                    error: function(){
                        console.log("failed to retrieve next step from Parse.");
                    }
            });
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
