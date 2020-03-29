const vm = require('vm'),
    request = require('./request-utilities.js').request,
    Settings = require('./csom-settings.js').Settings,
    Dependencies = require('./csom-dependencies.js').Dependencies,
    proxy = require('./xmlhttprequest-proxy.js'),
    AuthenticationContext = require('./auth/authentication-context.js');


const Loader = {

    LocalSettings: {
        path: "./sp_modules/"
    },

    resolvePath: function (basePath, module) {
        let path = basePath;
        if (module.lcid)
            path += module.lcid + "/";
        path += module.filename;
        return path;
    },


    loadFromPath: function (packages) {
        const self = this;
        packages.forEach(function (packageName) {
            Settings.packages[packageName].forEach(function (file) {
                const filePath = self.resolvePath(self.LocalSettings.path, file);
                const spm = require(filePath);
            });
        });
    }
};

module.exports = {
    setLoaderOptions: function (options) {
        const packages = options.packages || ['core'];
        if (packages.indexOf('core') === -1) packages.splice(0, 0, 'core');
        Dependencies.register();
        Loader.loadFromPath(packages);
        Dependencies.setDocumentProperty('URL', options.url);
    },
    getLoaderOptions : function (){
        return {url : Dependencies.getDocumentProperty('URL')}
    },
    AuthenticationContext: AuthenticationContext
};
