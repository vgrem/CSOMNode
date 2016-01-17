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
    
   
    
    
    loadFromPath : function (modules) {
        var self = this;
        modules.forEach(function (module) {
            var filePath = self.resolvePath(self.LocalServerSettings.path,module);
            var spm = require(filePath);
            //console.log("Module " + filePath + " has been loaded successfully..");
        });
    }


};

var exports = {
    setLoaderOptions: function(options) {
        Dependencies.register();
        Loader.loadFromPath(Settings.modules);
        Dependencies.setDocumentProperty('URL', options.url);
    },

    AuthenticationContext : AuthenticationContext

};
module.exports = exports;