var _ = require("underscore");
var User = Parse.User;

exports.index = function(req, res) {
  var query = new Parse.Query(User);
  query.ascending('createdAt');
  query.limit(10);
  query.find().then( function(results) {
    res.render('user/index.ejs', {
      users: results
    });
  },
  function() {
    res.send(500, 'Failed loading posts');
  });
};

exports.getMyHome = function(request, response)
{
    return response.render('user/userHome.ejs', {request: request});
}
