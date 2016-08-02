import React, { PropTypes } from "react"
import NavLink from "./NavLink"

const LandingPage = React.createClass({
    render () {
        var hiddenDivStyles = {
            position: "absolute",
            left: "-5000px"
        };

        var page =
        <div className="LandingPage" >
            <div className="cover black" data-color="black"></div>
            <div className="container">
                <NavLink className="loginLink" to={"/login"} activeClassName="active" tag="span">
                    Login
                </NavLink>
                <h1 className="logo cursive">
                    OneRoost
                </h1>
                <div className="content">
                    <h4 className="motto" id="mottoText">
                        Hello there again
                    </h4>
                    <div className="subscribe">
                        <h5 className="info-text" id="infoText">
                            Hello there
                        </h5>
                        <div className="row">
                            <div className="col-md-4 col-md-offset-4 col-sm6-6 col-sm-offset-3 ">
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
    })

    export default LandingPage
