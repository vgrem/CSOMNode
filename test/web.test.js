const csomapi = require("../lib/csom-loader");
const {settings} = require("../examples/settings");
const assert = require('assert');
const describe = require("mocha").describe;
const it = require("mocha").it;
const beforeEach = require("mocha").beforeEach;

csomapi.setLoaderOptions({url: settings.siteUrl});

describe('Web tests', function() {

    let ctx;

    beforeEach(async function() {
        ctx = await SP.ClientContext.connectWithUserCredentials(settings.username, settings.password);
        return ctx;
    });

    it('should return Web title',async function() {
        const web = ctx.get_web();
        ctx.load(web);
        await ctx.executeQuery();
        assert.ok(web.get_title());
    });

});
