var csomapi = require('../lib/csom-loader.js'),
    settings = require('./settings.js').settings;


csomapi.setLoaderOptions({url: settings.siteUrl, serverType: 'local', packages: [] });
var authCtx = new AuthenticationContext(settings.siteUrl);
authCtx.acquireTokenForUser(settings.username, settings.password, function (err, data) {

    var ctx = new SP.ClientContext(authCtx.path);
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