const csomapi = require("../lib/csom-loader");
const AuthenticationContext = csomapi.AuthenticationContext;
const {settings} = require("../examples/settings");


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
