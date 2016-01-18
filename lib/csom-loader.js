var vm = require('vm'),
    request = require('./request-utilities.js').request,
    Settings = require('./csom-settings.js').Settings,
    Dependencies = require('./csom-dependencies.js').Dependencies,
    proxy = require('./xmlhttprequest-proxy.js'),
    AuthenticationContext = require('./auth/authentication-context.js');


var Loader = {
    
    OnlineServerSettings: {
        version: '16.0.4719.1222',
        host: "static.sharepointonline.com",
        path: "/bld/_layouts/15/" + this.version + "/"
    },
    
    
    LocalServerSettings: {
        version: '16.0.4719.1222',
        path: "./sp_modules/"
    },
    
    
    resolvePath : function(basePath,module) {
        var path = basePath;
        if (module.lcid)
            path += module.lcid + "/";
        path += module.filename;
        return path;
    },
    
   
    
    
    loadFromPath : function (packages) {
        var self = this;
        packages.forEach(function (packageName) {
            Settings.packages[packageName].forEach(function(file) {
                var filePath = self.resolvePath(self.LocalServerSettings.path, file);
                var spm = require(filePath);
                //console.log("Module " + filePath + " has been loaded successfully..");
            });
        });
    }
};

var exports = {
    setLoaderOptions: function (options) {
        var packages = options.packages || ['core'];
        if (packages.indexOf('core') == -1) packages.splice(0, 0, 'core');
        Dependencies.register();
        //load packages
        Loader.loadFromPath(packages);
        Dependencies.setDocumentProperty('URL', options.url);
    },

    AuthenticationContext : AuthenticationContext

};
module.exports = exports;