define([ 'underscore', 'react', 'parse', 'parse-react', 'models/Deal', 'deal/Stakeholder', 'deal/AddStakeholderButton'], function( _, React, Parse, ParseReact, Deal, Stakeholder, AddStakeholderButton ){
		return React.createClass({
        mixins: [React.addons.LinkedStateMixin, ParseReact.Mixin],
		observe: function(){
            var user = Parse.User.current();
			var stakeholderQuery = (new Parse.Query("Stakeholder"));
			stakeholderQuery.equalTo( 'deal', this.props.deal );
			stakeholderQuery.include( "user" );
            return {
                stakeholders: stakeholderQuery
            }
        },
        getInitialState: function(){
            this.props.deal.objectId = this.props.deal.id;
            return {
                timeline: this.props.deal.get("profile").timeline,
                budgetHigh: this.props.deal.get("budget").high,
                budgetLow: this.props.deal.get("budget").low,
                stakeholderEmail: '',
                stakeholderName: '',
                summary: this.props.deal.get("summary"),
                visible: false,
                user: Parse.User.current(),
                deal: this.props.deal
            }
        },
		refreshStakeholders()
		{
			this.refreshQueries(["stakeholders"]);
		},
        removeStakeholder: function( deleted )
        {
			//TODO: use mutations to dispatch deletion of stakeholder
			// ParseReact.Mutation.Destroy( "Stakeholder",  )

        },
        saveProfile: function(){
            var self = this;
            var timeline = this.state.timeline;
            var low = this.state.budgetLow;
            var high = this.state.budgetHigh;

            var budget = {
                high: high,
                low: low
            };

            ParseReact.Mutation.Set( self.props.deal, {
                    budget: budget,
                    profile: {timeline: timeline},
                    summary: self.state.summary
                })
                .dispatch()
                .then(function(deal){
                    self.props.deal = deal;
                    self.addProfileUpdatedComment( deal );
                });
        },
        addProfileUpdatedComment: function(deal){
            var self = this;
            var message = self.state.user.get("username") + " updated the deal profile.";

            var comment = {
                deal: self.state.deal,
                message: message,
                author: null,
                username: "OneRoost Bot",
            };
            ParseReact.Mutation.Create('DealComment', comment).dispatch();
        },
        render: function(){
            var deal = this.props.deal;
            var profile = this;
            return(
                <div id="" className="container-fluid" >
                    <div className="row-fluid">
                        <div className="container-fluid">
                            <div className="form-group">
                                <label for="dealSummary">Objective / Summary</label>
                                <textarea id="dealSummary" placeholder="enter the deal summary / objective " valueLink={this.linkState('summary')} className="form-control" ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="row-fluid">
                        <div className="container-fluid">
                            <div className="row-fluid">
                                <div className="">
                                    <div className="form-group">
                                        <label for="timelineInput">Timeline</label>
                                        <div className="input-group">
                                            <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
                                            <input type="text" id="timelineInput" valueLink={this.linkState('timeline')} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row-fluid">
                                <div className="">
                                    <div className="form-group">
                                        <label for="budgetLowInput">Budget (Low)</label>
                                        <div className="input-group">
                                            <span className="input-group-addon">$</span>
                                            <input type="number" id="budgetLowInput" className="form-control" valueLink={this.linkState('budgetLow')} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label for="budgetHighInput">Budget (High)</label>
                                        <div className="input-group">
                                            <span className="input-group-addon">$</span>
                                            <input type="number" id="budgetHighInput" className="form-control" valueLink={this.linkState('budgetHigh')} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row-fluid">
                                    <button className="btn btn-success btn-xs" onClick={this.saveProfile}>Save Profile <i className="fa fa-check"></i></button>
                                </div>
                            </div>


                            <div className="row-fluid">
                                <div class="container-fluid">
                                    <h2>Stakeholders</h2>
                                    <ul className="list-unstyled" id="stakeholderList">
                                        {this.data.stakeholders.map( function(stakeholder){
                                                return (
													<Stakeholder
                                                    	stakeholder={stakeholder} >														
													</Stakeholder>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className="row-fluid">
                                <div className="form-inline">
                                    <div className="form-group">
                                        <label for="stakeholderNameInput" className="sr-only">Name</label>
                                        <input type="text" id="stakeholderNameInput" className="form-control" placeholder="Name" valueLink={this.linkState('stakeholderName')} />
                                    </div>
                                    <div className="form-group">
                                        <label for="stakeholderNameInput" className="sr-only">Email</label>
                                        <input type="text" id="stakeholderEmailInput" className="form-control" placeholder="Email" valueLink={this.linkState('stakeholderEmail')}  />
                                    </div>
                                    <div className="form-group">
                                        <AddStakeholderButton/>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            );
        }
    });
});
