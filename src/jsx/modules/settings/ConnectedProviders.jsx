import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import * as RoostUtil from "RoostUtil"
import {unlinkUserWithProvider} from "ducks/user"

class ConnectedProviders extends React.Component {
    static propTypes = {
        connectedProviders: PropTypes.arrayOf(PropTypes.string)
    }

    render () {
        const {
            connectedProviders,
            unlinkProvider
        } = this.props
        return <div className="oauthLogins">
            <div>
                <h3>Third Party Logins</h3>
            </div>
            <div display-if={connectedProviders.indexOf("google") === -1}>
                <GoogleLoginButton/>
            </div>
            <div className="connectedProviders" display-if={connectedProviders && connectedProviders.length > 0}>
                <ul className="list-unstyled list">
                    {connectedProviders.map((providerName, i) =>
                        <li key={`${providerName}_${i}`} className={"provider"}>
                            <div className="info">
                                <span className={`logo ${providerName}`}></span>
                                <span>{providerName}</span>
                            </div>
                            <div className="actions">
                                <button className="unlink btn btn-link" onClick={() => unlinkProvider(providerName)}>unlink</button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    const userState = state.user.toJS()
    const user = RoostUtil.getCurrentUser(state)
    const {connectedProviders} = userState
    return {
        user,
        connectedProviders,
        isLoading: userState.isLoading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        unlinkProvider: (provider) => {
            dispatch(unlinkUserWithProvider(provider))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedProviders);
