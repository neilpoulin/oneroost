import React, { PropTypes } from "react"
import Parse from "parse"
import NavLink from "./NavLink"
import { browserHistory, withRouter } from "react-router"

const LandingPage = withRouter( React.createClass({
    getLoginLink(){
        var user = Parse.User.current();
        if ( !user )
        {
            return {name: "Login", path: "/login"}
        }
        return {
            name: user.get("firstName") + " " + user.get("lastName"),
            path: "/roosts"
        }
    },
    render () {
        var hiddenDivStyles = {
            position: "absolute",
            left: "-5000px"
        };

        var {query={bg:""}} = this.props.location;

        var loginLink = this.getLoginLink();
        var page =
        <div className={"LandingPage " + query.bg} >
            <div className="container">
                <NavLink className="loginLink" to={loginLink.path} activeClassName="active" tag="span">
                    {loginLink.name}
                </NavLink>
                <h1 className="logo cursive">
                    OneRoost
                </h1>
                <div className="content">
                    <div className="motto">
                        <h4 >
                            B2B Sales is a group decision.
                            <br/> OneRoost gets everyone on the same page.
                        </h4>
                    </div>
                    <div className="chart">
                        <h4>
                            With OneRoost you can accomplish the following:
                        </h4>
                        <div className="row">
                            <div className="col-sm-3">
                                <div className="top-label">Discuss</div>
                                <i className={"fa fa-comments "} ></i>
                                <div className="details">No more email threads and miscommunication; all conversations in the same place</div>
                            </div>
                            <div className="col-sm-3">
                                <div className="top-label">Invite</div>
                                <i className="fa-users fa"></i>
                                <div className="details">Get all stakeholders up to speed without inefficient status meetings</div>
                            </div>
                            <div className="col-sm-3">
                                <div className="top-label">Action</div>
                                <i className={"fa fa-line-chart "}></i>
                                <div className="details">Get the ball rolling with next steps available to everyone</div>
                            </div>
                            <div className="col-sm-3">
                                <div className="top-label">Align</div>
                                <i className={"fa fa-signal "}></i>
                                <div className="details">Access all of the details that matter to your business in one glance</div>
                            </div>
                        </div>
                    </div>
                    <div className="subscribe">
                        <h5 className="info-text" id="infoText">
                            Request access to the Beta
                        </h5>
                        <div className="row">
                            <div className="">
                                <form role="form"
                                    action="//oneroost.us11.list-manage.com/subscribe/post?u=e7514b8a3c774c54e108d2fda&amp;id=80640b32c4"
                                    method="post"
                                    id="mc-embedded-subscribe-form"
                                    name="mc-embedded-subscribe-form"
                                    className="validate form-inline" target="_blank" >
                                    <div id="mc_embed_signup_scroll">
                                        <div className="form-group">
                                            <label className="sr-only" htmlFor="emailInput">Email address</label>
                                            <input type="email" className="form-control transparent" name="EMAIL" id="emailInput" placeholder="Your email here..."></input>
                                        </div>
                                        <div style={hiddenDivStyles}>
                                            <input type="text" name="b_e7514b8a3c774c54e108d2fda_80640b32c4" tabIndex="-1" value=""/>
                                        </div>
                                        <button type="submit" name="subscribe" id="mc-embedded-subscribe" className="btn btn-success btn-fill">Notify Me</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


            return page;
        }
    }) )

    export default LandingPage
