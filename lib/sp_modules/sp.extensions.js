const urlParser = require('url');
const {AuthenticationContext, getLoaderOptions} = require("../csom-loader");


(function () {


    SP.ClientContext.prototype.executeQuery = async function () {
        return new Promise((resolve, reject) => {
            this.executeQueryAsync(function () {
                resolve();
            }, function (sender, args) {
                reject(args);
            });
        });
    };


    SP.ClientContext.connectWithClientCredentials = async function(clientId, clientSecret) {
        const options = getLoaderOptions();
        const authCtx = new AuthenticationContext(options.url);
        return new Promise((resolve, reject) => {
            authCtx.acquireTokenForApp(clientId, clientSecret, (err, resp) => {
                if (err) {
                    reject(err);
                    return;
                }
                const urlInfo = urlParser.parse(options.url);
                const ctx = new SP.ClientContext(urlInfo.pathname);
                authCtx.setAuthenticationCookie(ctx);
                resolve(ctx);
            });
        });
    };


    SP.ClientContext.connectWithUserCredentials = async function(login, password) {
        const options = getLoaderOptions();
        const authCtx = new AuthenticationContext(options.url);
        return new Promise((resolve, reject) => {
            authCtx.acquireTokenForUser(login, password, (err, resp) => {
                if (err) {
                    reject(err);
                    return;
                }
                const urlInfo = urlParser.parse(options.url);
                const ctx = new SP.ClientContext(urlInfo.pathname);
                authCtx.setAuthenticationCookie(ctx);
                resolve(ctx);
            });
        });
    };

})();
