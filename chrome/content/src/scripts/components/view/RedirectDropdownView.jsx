import React from "react"
import PropTypes from "prop-types"
import {render} from "react-dom";
import {connect} from "react-redux"
import {LOAD_PAGES_ALIAS} from "actions/brandPages"

const composeText = "Thanks for reaching out."
+ "I'm excited to hear what more about your product/service."
+ "Please provide an overview of your offering by going to http://www.oneroost.com/"

function buildHtmlLink(vanityUrl){
    let $el = document.createElement("div")
    let jsx = <div>
            Thanks for reaching out. I{"'"}m excited to hear what more about your product/service.
            Please provide an overview of your offering by going to <a href={`https://www.oneroost.com/${vanityUrl}`}>{"my page"}</a>
        </div>
    render(jsx, $el)
    return $el;
}
class RedirectDropdownView extends React.Component {
    componentDidMount(){
        this.props.loadPages()
    }
    render () {
        const {composeView, isLoading, pages} = this.props
        return <div className="RedirectDropdownView">
            <div display-if={isLoading}>
                Loading....
            </div>
            <div display-if={!isLoading}>
                <ul className="vanityUrls">
                    {pages.map((page, i) => {
                        return <li key={`page_${i}`} onClick={() => composeView.insertHTMLIntoBodyAtCursor(buildHtmlLink(page.vanityUrl))}>/{page.vanityUrl}</li>
                    })}
                </ul>
            </div>
        </div>
    }
}

RedirectDropdownView.propTypes = {
    composeView: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
    const brandPages = state.brandPages
    if (brandPages.isLoading){
        return {
            isLoading: true
        }
    }
    return {
        isLoading: brandPages.isLoading,
        pages: brandPages.pages,

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadPages: () => {
            dispatch({
                type: LOAD_PAGES_ALIAS
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RedirectDropdownView)
