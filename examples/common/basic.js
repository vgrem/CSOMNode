const csomapi = require('csom-node');
const AuthenticationContext = require('csom-node').AuthenticationContext;
const settings = require('../settings.js').settings;


csomapi.setLoaderOptions({url: settings.siteUrl});
const authCtx = new AuthenticationContext(settings.siteUrl);
authCtx.acquireTokenForUser(settings.username, settings.password, function (err, data) {

    const ctx = new SP.ClientContext(authCtx.path);
    authCtx.setAuthenticationCookie(ctx);

    const web = ctx.get_web();
    ctx.load(web);
    ctx.executeQueryAsync(function () {
        console.log(web.get_title());
    },
    function (sender, args) {
        console.log('An error occured: ' + args.get_message());
    }); 
});
