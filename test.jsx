import React from "react"
import {render} from "react-dom"
import { Provider } from "react-redux"

const div = <div>Test Div</div>

render(
    <Provider>{div}</Provider>
    , document.getElementById("app"))
