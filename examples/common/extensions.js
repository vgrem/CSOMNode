const csomapi = require('csom-node');
const urlParser = require('url');
const AuthenticationContext = csomapi.AuthenticationContext;

async function executeQuery(context) {
    return new Promise((resolve, reject) => {
        context.executeQueryAsync(function () {
            resolve();
        }, function (sender, args) {
            reject(args);
        });
    });
}

async function getAuthenticatedContext(url, login,password, packages=[]) {
    csomapi.setLoaderOptions({ url: url, packages: packages });
    const authCtx = new AuthenticationContext(url);
    return new Promise((resolve, reject) => {
        authCtx.acquireTokenForUser(login, password, (err, resp) => {
            if (err) {
                reject(err);
                return;
            }
            const urlInfo = urlParser.parse(url);
            const ctx = new SP.ClientContext(urlInfo.pathname);
            authCtx.setAuthenticationCookie(ctx);
            resolve(ctx);
        });
    });
}

exports.getAuthenticatedContext = getAuthenticatedContext;
exports.executeQuery = executeQuery;
