import React, {PropTypes} from "react"
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
        var deal = this.props.deal ? <div className="roost-title hidden-lg hidden-md navbar-brand">{deal.dealName}</div> : null;
        var homeBtn = this.props.showHome ? <NavLink tag="div" to="/roosts" className="hidden-lg hidden-md navbar-brand account-link"><i className="fa fa-home fa-lg"></i></NavLink> : null;

        var landingPage = <NavLink tag="div" to="/" className={"navbar-brand account-link " + (this.props.showHome ? "visible-lg visible-md" : "") }>OneRoost</NavLink>;

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
                    {deal}
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav navbar-right">
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                                aria-expanded="false">
                                <i className="fa fa-user"></i> {user.get("firstName") + " " + user.get("lastName")} <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu">
                                <NavLink to="/logout"><i className="fa fa-sign-out"></i> Logout</NavLink>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>



        return nav;
    }
})

export default RoostNav
