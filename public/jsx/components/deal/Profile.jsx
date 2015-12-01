define([ 'underscore', 'react', 'parse', 'models/Deal', 'deal/Stakeholder'], function( _, React, Parse, Deal, Stakeholder ){
    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        getInitialState: function(){
            return {
                timeline: this.props.deal.get("profile").timeline,
                budgetHigh: this.props.deal.get("budget").high,
                budgetLow: this.props.deal.get("budget").low,
                stakeholderEmail: '',
                stakeholderName: '',
                stakeholders: this.props.deal.get("stakeholders"),
                summary: this.props.deal.get("summary"),
                visible: false
            }
        },
        addStakeholder: function( ){
            var component = this;
            var name = this.state.stakeholderName;
            var email = this.state.stakeholderEmail;

            var existing = _.find( this.state.stakeholders, function( s ){
                return ( s.name == name && s.email == email );
            });

            if ( existing != undefined )
            {
                console.log("stakeholder already exists");
                return;
            }

            this.state.stakeholders.push( {
                name: this.state.stakeholderName,
                email: this.state.stakeholderEmail
            });
            this.props.deal.save( {stakeholders: this.state.stakeholders}, {
                success: function( deal ){
                    console.log("saved stakeholders");
                    component.props.deal = deal;
                    component.setState({
                        'stakeholderName': '',
                        'stakeholderEmail': ''
                    });
                    component.render();
                },
                error: function(){
                    console.error( "failed to save deal" )
                }
            });
        },
        removeStakeholder: function( deleted )
        {
            var profile = this;
            var stakeholders = [];
            // $(node).remove();
            stakeholders = _.reject( this.state.stakeholders, function( current ){
                return (current.name == deleted.name && current.email == deleted.email);
            });

            this.props.deal.save({stakeholders: stakeholders}, {
                success: function( deal ){
                    profile.props.deal = deal;
                    profile.setState({stakeholders: stakeholders});
                },
                error: function()
                {
                    console.log( "failed to save deal for stakeholders");
                }
            });
        },
        saveProfile: function(){
            var props = this.props;
            var timeline = this.state.timeline;
            var low = this.state.budgetLow;
            var high = this.state.budgetHigh;

            var budget = {
                high: high,
                low: low
            };

            this.props.deal.save({
                    budget: budget,
                    profile: {timeline: timeline},
                    summary: this.state.summary
                },
                {
                    success: function( deal ){
                        props.deal = deal;
                    },
                    error: function(){

                    }
                });
        },
        componentDidMount: function()
        {
            var component = this;
            $('#profileAccordion')
            .on('hidden.bs.collapse shown.bs.collapse', function () {
                component.props.stopResize();
            })
            .on('hide.bs.collapse show.bs.collapse', function () {
                component.setState({visible: !component.state.visible});
                component.props.startResize();
            });
        },
        render: function(){
            var deal = this.props.deal;
            var profile = this;
            return(
                <div className="row" id="dealProfileContainer">
                    <div className="panel-group" id="profileAccordion" role="tablist" aria-multiselectable="true" role="tabpanel" aria-labelledby="dealProfileHeading" >
                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="deapProfileHeading">
                                <h4 className="panel-title">
                                    <a role="button"
                                        data-toggle="collapse"
                                        data-parent="#profileAccordion"
                                        href="#dealProfileBody"
                                        aria-expanded={this.state.visible ? 'true' : 'false'}
                                        aria-controls="dealProfileBody"
                                        className={this.state.visible ? '' : 'collapsed'}
                                    >
                                        Deal Profile
                                    </a>
                                </h4>
                            </div>
                            <div id="dealProfileBody" className="panel-collapse collapse {this.state.visible ? 'in' : ''}" role="tabpanel" aria-labelledby="dealProfileHeading">
                                <div className="panel-body">
                                    <div className="row">
                                        <div className="container">
                                            <div className="form-group">
                                                <label for="dealSummary">Objective / Summary</label>
                                                <textarea id="dealSummary" placeholder="enter the deal summary / objective " valueLink={this.linkState('summary')} className="form-control" ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="container">
                                            <div className="col-md-6">
                                                <div className="row">
                                                    <h2>Profile</h2>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        <div className="form-group">
                                                            <label for="timelineInput">Timeline</label>
                                                            <div className="input-group">
                                                                <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
                                                                <input type="date" id="timelineInput" valueLink={this.linkState('timeline')} className="form-control" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-7 col-md-offset-1">
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
                                            </div>
                                            <div className="col-md-5 col-md-offset-1">
                                                <div className="row">
                                                    <div class="container">
                                                        <h2>Stakeholders</h2>
                                                        <ul className="list-unstyled" id="stakeholderList">
                                                            {this.state.stakeholders.map( function(stakeholder){
                                                                    return (<Stakeholder
                                                                        stakeholder={stakeholder}
                                                                        onDelete={profile.removeStakeholder}
                                                                        ></Stakeholder>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="row">
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
                                                            <button className="form-control" onClick={this.addStakeholder} ><i className="fa fa-plus"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
