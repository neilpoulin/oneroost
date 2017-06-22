import React, {Component} from "react";
import PropTypes from "prop-types"
import {connect} from "react-redux"
import Clickable from "Clickable"

class ThreadView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    render() {
        const {count, addCount, subject} = this.props
        return (
            <div>
                <div className="subject">{subject}</div>
                <div>Count: {count}</div>
                <Clickable text="Click Me" onClick={addCount}/>
            </div>
        );
    }
}

ThreadView.propTypes = {
    subject: PropTypes.string
}

const mapStateToProps = (state) => {
    return {
        count: state.count,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addCount: () => dispatch({type: "ADD_COUNT"})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadView);
