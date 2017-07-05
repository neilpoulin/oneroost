import React from "react"
import PropTypes from "prop-types"
class RedirectDropdownView extends React.Component {
    render () {
        const {composeView} = this.props
        return <div>
            <div onClick={() => composeView.insertTextIntoBodyAtCursor("Test from button!")}>Button 1</div>
            <div>button 2</div>
        </div>
    }
}

RedirectDropdownView.propTypes = {
    composeView: PropTypes.object.isRequired
}

export default RedirectDropdownView;
