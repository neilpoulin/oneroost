var AccountListItem = React.createClass({
  mixins: [ParseReact.Mixin], // Enable query subscriptions

  observe: function() {
    // Subscribe to all Comment objects, ordered by creation date
    // The results will be available at this.data.comments
    return {
      users: (new Parse.Query('User')).ascending('createdAt')
    };
  },

  render: function() {
    // Render the text of each comment as a list item
    return (
      <ul>
        {this.data.users.map(function(c) {
          return <li>{c.id}</li>;
        })}
      </ul>
    );
  }
});
