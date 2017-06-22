import React, {Component} from "react";
import {connect} from "react-redux";

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {count} = this.props
        return (
            <div>
                Hello World {count}
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        count: store.count
    }
}

export default connect(mapStateToProps)(App)
