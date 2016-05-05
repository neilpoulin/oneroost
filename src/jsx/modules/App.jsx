import React from 'react'
import { Link } from 'react-router'
import TopNav from './navigation/TopNav';

export default React.createClass({
    render() {
        return (
            <div >
                <TopNav/>
                {this.props.children}
            </div>
        )
    }
})
