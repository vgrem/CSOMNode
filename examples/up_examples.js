var csomapi = require('../lib/csom-loader.js'),
    settings = require('./settings.js').settings;


var webAbsoluteUrl = settings.tenantUrl + settings.webUrl;


csomapi.setLoaderOptions({ url: webAbsoluteUrl, packages: ['userprofile'] });


var authCtx = new AuthenticationContext(webAbsoluteUrl);
authCtx.acquireTokenForUser(settings.username, settings.password, function (err, data) {
    
    
    var ctx = new SP.ClientContext(settings.webUrl);
    authCtx.setAuthenticationCookie(ctx);
    
    loadSiteUsers(ctx, function (err, users) {
        if (err) {
            console.log(String.format("An error occured while getting site users: {0}", err.get_message()));
        }
        
        
        var peopleManager = new SP.UserProfiles.PeopleManager(ctx);
        //load user profile properties such as Personal Site Url
        var result = users.get_data().map(function (user) {
            var property = peopleManager.getUserProfilePropertyFor(user.get_loginName(), 'WorkEmail');
            return { "loginName": user.get_loginName(), "property" : property };
        });
        
        ctx.executeQueryAsync(function () {
            result.forEach(function (item) {
                console.log(String.format("Login: {0} \t Work email: {1}", item.loginName, item.property.get_value()));
            });

            
        },
        function (sender, args) {
            console.log(String.format("An error occured while getting users profile properies: {0}", args.get_message()));
        });

    });
    
      
 
});




function loadSiteUsers(ctx, callback) {
    var web = ctx.get_web();
    var users = web.get_siteUsers();
    ctx.load(users);
    ctx.executeQueryAsync(function () {
        callback(null,users);
    },
    function (sender, args) {
        callback(args);
    });
}