const settings = require('../settings.js').settings;
const csomapi = require("../../lib/csom-loader");

csomapi.setLoaderOptions({url: settings.siteUrl, packages: ['taxonomy']});

(async () => {
    const ctx = await SP.ClientContext.connectWithUserCredentials(settings.username, settings.password);
    const groups = await loadTermSets(ctx);
    for(let group of groups.get_data()){
        console.log(String.format('Group: {0}', group.get_name()));
        group.get_termSets().get_data().forEach((ts) => {
            console.log(String.format('\tTerm Set: {0}', ts.get_name()));
        });
    }

})().catch(logError);


async function loadTermSets(ctx) {
    const taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(ctx);
    const termStore = taxSession.getDefaultSiteCollectionTermStore();
    const groups = termStore.get_groups();
    ctx.load(groups,'Include(Name,TermSets)');
    await ctx.executeQuery();
    return groups;
}

function logError(sender, args) {
    console.log('An error occured: ' + args.get_message());
}
