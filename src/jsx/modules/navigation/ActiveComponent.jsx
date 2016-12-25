// copied from https://github.com/insin/react-router-active-component/blob/master/src/index.js
// in order to manage my own dependencies

import React, {PropTypes as t} from "react"
import {Link} from "react-router"
import {withRouter} from "react-router"

let {toString} = Object.prototype

let typeOf = o => toString.call(o).slice(8, -1).toLowerCase()

function createLocationDescriptor({to, query, hash, state}) {
    if (typeOf(to) === "string") {
        return {pathname: to, query, hash, state}
    }
    return {query, hash, state, ...to}
}

module.exports = function activeComponent(Component, options) {
    if (!Component) {
        throw new Error("activeComponent() must be given a tag name or React component")
    }

    options = {
        link: true,
        linkClassName: undefined,
        ...options,
    }

    let ActiveComponent = React.createClass({
        propTypes: {
            activeClassName: t.string.isRequired,
            router: t.object.isRequired,
            to: t.oneOfType([t.string, t.object]).isRequired,
            params: t.object.isRequired,
            location: t.object.isRequired,
            routes: t.array.isRequired,
            activeStyle: t.object,
            className: t.string,
            hash: t.string,
            link: t.bool,
            linkProps: t.object,
            onlyActiveOnIndex: t.bool,
            query: t.object,
        },

        getDefaultProps() {
            return {
                activeClassName: "active",
                link: options.link,
                onlyActiveOnIndex: false,
                className: ""
            }
        },

        render() {
            let {
                link,
                linkProps,
                to,
                query,
                hash,
                state,
                onlyActiveOnIndex,
                activeClassName,
                activeStyle,
                router,
                ...props,
            } = this.props
            let location = createLocationDescriptor({to, query, hash, state})

            if (router) {
                let active = router.isActive(location, onlyActiveOnIndex)
                if (typeOf(Component) !== "string") {
                    props.active = active
                }

                if (active) {
                    if (activeClassName) {
                        props.className = `${props.className || ""}${props.className ? " " : ""}${activeClassName}`
                    }
                    if (activeStyle) {
                        props.style = {...props.style, activeStyle}
                    }
                }
            }

            if (!link) {
                return <Component {...props}>{this.props.children}</Component>
            }

            return <Component className={props.className}>
                <Link className={options.linkClassName} {...linkProps} to={location}>
                    {this.props.children}
                </Link>
            </Component>
        }
    })
    
    return withRouter(ActiveComponent)
}
