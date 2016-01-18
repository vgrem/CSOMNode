var csomapi = require('csom-node'),
    settings = require('./settings.js').settings;



csomapi.setLoaderOptions({ url: settings.tenantUrl + settings.webUrl, serverType: 'local', packages: ['taxonomy'] });


var authCtx = new AuthenticationContext(settings.tenantUrl + settings.webUrl);
authCtx.acquireTokenForUser(settings.username, settings.password, function (err, data) {
    
    if (err) {
        console.log(String.format('An error occured while authentication: {0}', err));
        return;
    }
    
    var ctx = new SP.ClientContext(settings.webUrl);
    authCtx.setAuthenticationCookie(ctx);
    loadTermSets(ctx, function(err, data) {
        data.get_data().forEach(function(g) {
            console.log(String.format('Group: {0}', g.get_name()));
            g.get_termSets().get_data().forEach(function (ts) {
                console.log(String.format('\tTerm Set: {0}', ts.get_name()));
            });
        });
    });
});


function loadTermSets(ctx, callback) {
    var taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(ctx);
    var termStore = taxSession.getDefaultSiteCollectionTermStore();
    var groups = termStore.get_groups();
    ctx.load(groups,'Include(Name,TermSets)');
    ctx.executeQueryAsync(function() {
            callback(null, groups);
        },
        function(sender, args) {
            callback(args.get_message(), null);
        });
}

function logError(sender, args) {
    console.log('An error occured: ' + args.get_message());
}