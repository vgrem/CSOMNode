const csomapi = require("../../lib/csom-loader");
const settings = require('../settings.js').settings;

csomapi.setLoaderOptions({url: settings.siteUrl, packages: ['userprofile','publishing']});

(async () => {
    try{
        const ctx = await SP.ClientContext.connectWithUserCredentials(settings.username, settings.password);
        const users = await loadSiteUsers(ctx);
        const peopleManager = new SP.UserProfiles.PeopleManager(ctx);
        for(let user of users.get_data()){
            const property = peopleManager.getUserProfilePropertyFor(user.get_loginName(), 'WorkEmail');
            await ctx.executeQuery();
            console.log(String.format("Login: {0} \t Work email: {1}", user.get_loginName(), property.get_value()));
        }

    }
    catch (e) {
        console.log(String.format("An error occured while getting site users: {0}", e.get_message()));
    }

})().catch(logError);


function logError(sender, args) {
    console.log('An error occured: ' + args.get_message());
}


async function loadSiteUsers(ctx, callback) {
    const web = ctx.get_web();
    const users = web.get_siteUsers();
    ctx.load(users);
    await ctx.executeQuery();
    return users;
}
