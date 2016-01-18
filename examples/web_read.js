var csomapi = require('csom-node'),
    settings = require('./settings.js').settings;


var webAbsoluteUrl = settings.tenantUrl + settings.webUrl;


csomapi.setLoaderOptions({url: webAbsoluteUrl, serverType: 'local', packages: [] });


var authCtx = new AuthenticationContext(webAbsoluteUrl);
authCtx.acquireTokenForUser(settings.username, settings.password, function (err, data) {
    
    
    var ctx = new SP.ClientContext(settings.webUrl);
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