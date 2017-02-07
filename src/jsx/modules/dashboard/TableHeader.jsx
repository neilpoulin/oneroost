import React, { PropTypes } from "react"

const TableHeader = React.createClass({
    propTypes: {
        columns: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            clickable: PropTypes.bool,
            sortable: PropTypes.bool,
        })).isRequired
    },
    render () {
        return (
            <thead>
                <tr>
                    {this.props.columns.map(({label, clickable, sortable}, i) => {
                        return <th key={"header_" + i}>{label}</th>
                    })}
                </tr>
            </thead>
        )
    }
})

export default TableHeader
