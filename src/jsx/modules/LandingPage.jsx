import React, { PropTypes } from "react"
import Logo from "Logo"
import {Link} from "react-router"
import { withRouter } from "react-router"

const LandingPage = withRouter(React.createClass({
    PropTypes: {location: PropTypes.object.isRequired},
    componentDidMount(){
        document.title = "OneRoost"
    },
    getInitialState(){
        return {
            email: ""
        }
    },
    _submitEmail(e){
        const value = e.value
        this.setState({email: value});
    },
    render () {
        const {email, errors={}} = this.props
        var page =
        <div className={"LandingPage"} >
            <section className="background-primary textured">
                <div className="container">
                    <div className="logoContainer">
                        <Logo/>
                    </div>

                    <div className="heroContainer">
                        <h1>Send a link, Get pitched on your terms.</h1>
                        <p className="tagline">blah blah blah balh </p>
                    </div>
                    <div className="emailContainer">
                        <input type="email"
                            autoFocus={true}
                            value={email}
                            placeholder={"Email Address"}
                            name="email"
                            autoComplete={"email"}
                            >
                        </input>
                        <button onClick={this._submitEmail}
                            className="btn btn-outline-white"
                            >Get on the list</button>
                    </div>
                    <div className="actionSubTextContainer">
                        test test blah blah
                    </div>
                </div>
            </section>
            <section className="textInfo background-light">
                <div className="info">
                    <h3 className="title">Top of the funnel</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
                <div className="info">
                    <h3 className="title">Combine into one platform</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
                <div className="info">
                    <h3 className="title">Analyze outcomes</h3>
                    <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                    </p>
                </div>
            </section>
            <footer className="background-primary">
                <div className="container">
                    &copy; 2017 OneRoost | <Link to="/terms">Terms and Conditions</Link>
                </div>
            </footer>
        </div>
        return page;
    }
}))

export default LandingPage
