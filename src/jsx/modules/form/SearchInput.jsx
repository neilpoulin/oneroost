import React, { PropTypes } from "react"
import * as log from "LoggingUtil"

const SearchInput = React.createClass({
    propTypes: {
        onKeyUp: PropTypes.func,
        onSearch: PropTypes.func,
    },
    getInitialState(){
        return {
            value: ""
        }
    },
    getDefaultProps(){
        return {
            onKeyUp: () => {
                log.info("key up on search no implemented")
            },
            onSearch: () => this.props.onKeyUp
        }
    },
    handleKeyUp(e){
        const el = e.target;
        const value = el.type === "checkbox" ? el.checked : el.value.trim();

        this.setState({value: value});
        this.props.onKeyUp(value);
    },
    handleChange(e){
        const el = e.target;
        const value = el.type === "checkbox" ? el.checked : el.value.trim();

        this.setState({value: value});
        this.props.onKeyUp(value);
    },
    handleClick(){
        this.props.onSearch(this.state.value);
    },
    render () {
        return (
            <div className="SearchInput input-icon">
                <span className="icon">
                    <i className="fa fa-search"></i>
                </span>
                <input type="search" className="form-control" placeholder="Search" onKeyUp={this.handleKeyUp} onChange={this.handleChange} />
            </div>
        )
    }
})

export default SearchInput
