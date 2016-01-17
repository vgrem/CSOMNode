var csomapi = require('../lib/csom-loader.js');

var settings = {
    url: "https://contoso.sharepoint.com/",
    username: "jdoe@contoso.onmicrosoft.com",
    password: ""
};

csomapi.setLoaderOptions({url: settings.url, serverType: 'local', packages: [] });


var authCtx = new AuthenticationContext(settings.url);
authCtx.acquireTokenForUser(settings.username, settings.password, function (err, data) {
    
    var ctx = new SP.ClientContext("/");
    authCtx.setAuthenticationCookie(ctx);
    
    var web = ctx.get_web();
    ctx.load(web);
    ctx.executeQueryAsync(function () {
        console.log(web.get_title());
    },
    function (sender, args) {
        console.log('An error occured: ' + args.get_message());
    });
      
 
});