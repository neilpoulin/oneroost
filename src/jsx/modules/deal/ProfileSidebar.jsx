import React from "react"
import Parse, {PropTypes} from "parse"
import ParseReact from "parse-react"
import Stakeholder from "Stakeholder"
import AddStakeholderButton from "AddStakeholderButton"
import {linkState} from "LinkState"

export default React.createClass({
	propTypes: {
		deal: PropTypes.shape({
			id: PropTypes.any.isRequired,
			budget: PropTypes.shape({
				high: PropTypes.any,
				low: PropTypes.any
			}),
			profile: PropTypes.shape({
				timeline: PropTypes.any
			}).isRequired,
			summary: PropTypes.string
		}).isRequired
	},
	observe: function(){
		var stakeholderQuery = new Parse.Query("Stakeholder");
		stakeholderQuery.equalTo( "deal", this.props.deal.objectId );
		stakeholderQuery.include( "user" );
		return {
			stakeholders: stakeholderQuery
		}
	},
	getInitialState: function(){
		this.props.deal.objectId = this.props.deal.id;
		return {
			timeline: this.props.deal.profile.timeline,
			budgetHigh: this.props.deal.budget.high,
			budgetLow: this.props.deal.budget.low,
			stakeholderEmail: "",
			stakeholderName: "",
			summary: this.props.deal.summary,
			visible: false,
			user: Parse.User.current(),
			deal: this.props.deal
		}
	},
	refreshStakeholders()
	{
		this.refreshQueries(["stakeholders"]);
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
		ParseReact.Mutation.Create("DealComment", comment).dispatch();
	},
	render: function(){
		var sidebar =
		<div id="" className="container-fluid" >
			<div className="row-fluid">
				<div className="container-fluid">
					<div className="form-group">
						<label htmlFor="dealSummary" className="control-label">Objective / Summary</label>
						<textarea id="dealSummary"
                            placeholder="enter the deal summary / objective "
                            value={this.state.summary}
                            onChange={linkState(this,"summary")}
                            className="form-control" ></textarea>
					</div>
				</div>
			</div>
			<div className="row-fluid">
				<div className="container-fluid">
					<div className="row-fluid">
						<div className="">
							<div className="form-group">
								<label htmlFor="timelineInput" className="control-label">Timeline</label>
								<div className="input-group">
									<span className="input-group-addon"><i className="fa fa-calendar"></i></span>
									<input type="text"
                                        id="timelineInput"
                                        value={this.state.timeline}
                                        onChange={linkState(this, "timeline")}
                                        className="form-control" />
								</div>
							</div>
						</div>
					</div>
					<div className="row-fluid">
						<div className="">
							<div className="form-group">
								<label htmlFor="budgetLowInput" className="control-label">Budget (Low)</label>
								<div className="input-group">
									<span className="input-group-addon">$</span>
									<input type="number"
                                        id="budgetLowInput"
                                        className="form-control"
                                        value={this.state.budgetLow}
                                        onChange={linkState(this, "budgetLow")} />
								</div>
							</div>
							<div className="form-group">
								<label htmlFor="budgetHighInput" className="control-label">Budget (High)</label>
								<div className="input-group">
									<span className="input-group-addon">$</span>
									<input type="number"
                                        id="budgetHighInput"
                                        className="form-control"
                                        value={this.state.budgetHigh}
                                        onChange={linkState(this, "budgetHigh")} />
								</div>
							</div>
						</div>
						<div className="row-fluid">
							<button className="btn btn-success btn-xs" onClick={this.saveProfile}>Save Profile <i className="fa fa-check"></i></button>
						</div>
					</div>


					<div className="row-fluid">
						<div className="container-fluid">
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
								<label htmlFor="stakeholderNameInput" className="sr-only">Name</label>
								<input type="text"
                                    id="stakeholderNameInput"
                                    className="form-control"
                                    placeholder="Name"
                                    value={this.state.stakeholderName}
                                    onChange={linkState(this, "stakeholderName")} />
							</div>
							<div className="form-group">
								<label htmlFor="stakeholderNameInput" className="sr-only">Email</label>
								<input type="text"
                                    id="stakeholderEmailInput"
                                    className="form-control"
                                    placeholder="Email"
                                    value={this.state.stakeholderEmail}
                                    onChange={linkState(this, "stakeholderEmail")} />
							</div>
							<div className="form-group">
								<AddStakeholderButton/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>;

		return sidebar;
	}
});
