import React, { PropTypes } from "react"
import RoostNav from "./../navigation/RoostNav";
import ParseReact from "parse-react"
import Parse from "parse"
import LoadingTakeover from "./../util/LoadingTakeover"
import RoostUtil from "./../util/RoostUtil"
import FourOhFourPage from "./../FourOhFourPage"

const PublicProfilePage = React.createClass({
    mixins: [ParseReact.Mixin],
    propTypes: {
        params: PropTypes.shape({
            userId: PropTypes.string.isRequired
        }).isRequired
    },
    observe(props, state){
        var userId= props.params.userId;
        return {
            profileUser: (new Parse.Query("User")).equalTo( "objectId", userId )
        }
    },

    render () {
        if ( this.pendingQueries().length > 0 ){
            return <LoadingTakeover messsage={"Loading Profile"}/>
        }
        if( this.data.profileUser.length < 1 )
        {
            return <FourOhFourPage/>
        }

        var profileUser = this.data.profileUser[0];

        var page =
        <div className="PublicProfilePage">
            <RoostNav showHome={true}/>
            <div className="container">
                Public Profile Page for {RoostUtil.getFullName(profileUser)}
            </div>

        </div>

        return page
    }
})

export default PublicProfilePage
