const {executeQuery, getAuthenticatedContext} = require('./extensions');
const settings = require('../settings.js').settings;


(async () => {

    const ctx = await getAuthenticatedContext(settings.siteUrl,settings.username, settings.password, ['taxonomy']);

    const groups = await loadTermSets(ctx);
    groups.get_data().forEach((g) => {
        console.log(String.format('Group: {0}', g.get_name()));
        g.get_termSets().get_data().forEach((ts) => {
            console.log(String.format('\tTerm Set: {0}', ts.get_name()));
        });
    });

})().catch(logError);


async function loadTermSets(ctx) {
    const taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(ctx);
    const termStore = taxSession.getDefaultSiteCollectionTermStore();
    const groups = termStore.get_groups();
    ctx.load(groups,'Include(Name,TermSets)');
    await executeQuery(ctx);
    return groups;
}

function logError(sender, args) {
    console.log('An error occured: ' + args.get_message());
}
