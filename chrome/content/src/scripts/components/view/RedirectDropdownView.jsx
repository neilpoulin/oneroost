import React from "react"
import PropTypes from "prop-types"
import {render} from "react-dom";
import {connect} from "react-redux"
import {LOAD_PAGES_ALIAS} from "actions/brandPages"

function buildHtmlLink(vanityUrl, toName){
    let $el = document.createElement("div")
    let jsx = <div>
            Thanks for reaching out{`${toName ? `, ${toName}` : ""}`}. I{"'"}m excited to hear what more about your product/service.
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
        const {isLoading, pages, insertLink, toName} = this.props
        return <div className="RedirectDropdownView">
            <div display-if={isLoading}>
                Loading....
            </div>
            <div display-if={!isLoading}>
                <span>Brand Page Urls</span>
                <ul className="vanityUrls">
                    {pages.map((page, i) => {
                        return <li key={`page_${i}`} onClick={() => insertLink(page.vanityUrl, toName)}>/{page.vanityUrl}</li>
                    })}
                </ul>
            </div>
        </div>
    }
}

RedirectDropdownView.propTypes = {
    composeView: PropTypes.object.isRequired,
    insertLink: PropTypes.func.isRequired,
    loadPages: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
    const brandPages = state.brandPages
    if (brandPages.isLoading){
        return {
            isLoading: true
        }
    }
    const {composeView} = ownProps
    let to = null;
    try{
        let recipients = composeView.getToRecipients()
        if(recipients.length > 0){
            to = recipients[0]
        }
    }
    catch(e){}

    return {
        isLoading: brandPages.isLoading,
        pages: brandPages.pages,
        toName: to ? to.name : null,
        toEmail: to ? to.emailAddress : null,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadPages: () => {
            dispatch({
                type: LOAD_PAGES_ALIAS
            })
        },
        insertLink: (vanityUrl, toName) => {
            console.log("TODO: Adding filter")
            ownProps.composeView.insertHTMLIntoBodyAtCursor(buildHtmlLink(vanityUrl, toName))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RedirectDropdownView)
