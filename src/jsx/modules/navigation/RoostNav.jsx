import React, {PropTypes} from "react"
import {Link} from "react-router"
import NavLink from "./../NavLink";
import Parse from "parse";
import Bootstrap from "bootstrap";

const RoostNav = React.createClass({
    propTypes: {
        deal: PropTypes.object,
        showHome: PropTypes.bool
    },
    getDefaultProps: function(){
        return {
            showHome: true
        }
    },
    render () {
        var user = Parse.User.current();
        var deal = this.props.deal;
        var dealTitle = this.props.deal ? <div className="roost-title hidden-lg hidden-md navbar-brand">{deal.dealName}</div> : null;
        var homeBtn = this.props.showHome ? <NavLink tag="div" to="/roosts" className="hidden-lg hidden-md navbar-brand account-link"><i className="fa fa-home fa-lg"></i></NavLink> : null;
        var chickenSvg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 338 356" ><path className="logo-chicken" d="m145.3 357.1c-5.4-1.8-12.9-4.6-16.6-6.2-3.7-1.6-9.1-2.9-12.1-2.9-4.9 0-5.5-0.6-5.5-5.5 0-3.2-1.1-5.9-2.7-6.5-3.4-1.3-3.5-4.2-0.2-4.2 1.7 0 3.1-4.3 4.6-13.1 1.7-10.8 1.7-14.4-0.5-20.4-5.7-16-9.9-22.1-18.7-26.6-10.5-5.3-28.1-23.5-32.8-33.8-1.9-4.2-3.5-11.2-3.5-15.5 0-7.2-1.1-8.8-13.5-21.9-7.4-7.8-13.5-15-13.5-16 0-1-5.3-8-11.7-15.6-6.4-7.6-11.7-14.4-11.7-15.3 0-2.7 4.2-4.3 13.4-5.3l9-0.9-6.7-7.4c-3.7-4.1-6.7-7.9-6.7-8.5 0-0.6 3.2-2.7 7.2-4.8 4-2 7.2-4.4 7.2-5.3 0-1.3-7.7-4.7-22.9-10-1.2-0.4-2.2-1.6-2.2-2.5 0-2.3 12.8-12.8 15.7-12.8 4.3 0 2.3-6.5-4-12.6-4.5-4.4-5.7-6.5-4-7.5 4-2.6 20.1-1.6 24.5 1.4 3.6 2.5 4.5 2.6 6.8 0.3 3.4-3.4 1.4-8.4-4.2-10.6-2.4-0.9-9.5-1.7-15.8-1.7-6.3 0-11.9-0.7-12.5-1.7-2.8-4.5 25.3-18.3 39.6-19.5 10.7-0.9 11.2-0.7 18.6 6 4.2 3.8 15.1 18.2 24.4 32.1 27.8 41.9 33.3 45.4 57.7 36.9 5.8-2 19.5-4.9 30.2-6.4 26.5-3.7 37.8-9.6 53.2-27.8 6.6-7.8 7.4-9.7 5.9-13.2-1.1-2.5-1.2-5.1-0.2-7 1.4-2.5 15.4-15 33.5-30.1 3.4-2.8 4-5.2 4-14.1 0-12.4 2.2-15.3 11.1-14.4 5 0.5 6.2 1.5 7.6 6.5 1.8 6.3 1.3 6.1 13.3 2.8 3.9-1.1 4-0.8 3 6-0.9 5.5-0.5 7.4 1.6 8.2 1.5 0.6 3.3 3.5 3.9 6.5 1.1 5.2 9.2 13.8 18.9 20.3 5 3.3 4.8 3.5-8.8 7l-7.9 2 1 17.6c0.5 9.7 0.4 18.4-0.2 19.4-0.6 1-3.2 1.7-5.7 1.6-4.1-0.2-4.5 0.4-4.4 7 0 4 0.8 13.5 1.6 21.2l1.5 14-6.3 6c-10.6 10-15.4 22.7-17.4 46.1-2.4 27.1-6.4 35.5-24 50.3-12.3 10.3-48.6 37.4-69.1 51.6-10.6 7.3-11.5 10.5-4.9 18.3 10.8 12.9 32.4 22.6 57 25.7 21.6 2.7 24.2 4.1 12.3 7-6.3 1.5-14.2 1.8-24.1 1-8.1-0.7-23-1.5-33.2-1.8-10.2-0.3-18.9-0.9-19.5-1.4-0.5-0.5 1.5-2.4 4.6-4.2 3-1.8 5.5-3.7 5.5-4.2 0-0.5-5.7-7.6-12.7-15.8-7.9-9.3-14-14.8-16.3-14.8-2 0-5.5-1.9-7.9-4.3-5.3-5.3-11.7-4.4-25.3 3.5-11 6.4-11.5 7.1-11.5 17 0 12.6 3.5 16.1 15.8 16.2 14.6 0 29.2 2 28.1 3.8-0.5 0.9-2.9 1.6-5.2 1.6-6.2 0-7 2.8-1.8 6.9 2.5 2 4.5 4 4.5 4.6 0 2-8 0.9-18-2.4z"/></svg>
        var landingPage = <Link to="/" className={"navbar-brand account-link " + (this.props.showHome ? "visible-lg visible-md" : "") }>{chickenSvg}<span className="title">OneRoost</span></Link>;

        var nav =
        <nav className="navbar navbar-default navbar-fixed-top RoostNav">
            <div className="container-fluid">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    {landingPage}
                    {homeBtn}
                    {dealTitle}
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav navbar-right">
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                                aria-expanded="false">
                                <i className="fa fa-user"></i> {user.get("firstName") + " " + user.get("lastName")} <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu">
                                <NavLink to="/roosts"><i className="fa fa-list"></i> My Roosts</NavLink>
                                <NavLink to="/account"><i className="fa fa-gear"></i> My Account</NavLink>
                                <NavLink to="/logout"><i className="fa fa-sign-out"></i> Logout</NavLink>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>;



        return nav;
    }
})

export default RoostNav
