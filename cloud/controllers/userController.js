var envUtil = require("cloud/util/envUtil.js");
var _ = require("underscore");
var User = Parse.User;
var Deal = Parse.Object.extend("Deal");

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

exports.getMyHome = function(request, response ){
    return response.render('user/userHome.ejs', envUtil.getEnv().json );
}

exports.getDealPage = function( request, response, dealId ){
    var query = new Parse.Query(Deal);
    console.log("Loading deal page for deal Id = " + dealId)
    var props = envUtil.getEnv().json;
    props['dealId'] = dealId;
    console.log(props);
    response.render('user/deal.ejs', props );
}
