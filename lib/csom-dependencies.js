/**
 * Dependencies for SharePoint CSOM API.
 */

var Dependencies = {
    
    register: function () {
        
        global.navigator = {
            userAgent: "Node"
        };
        
        
        global.document = {
            documentElement: {},
            URL: '',
            getElementsByTagName: function (name) {
                return [];
            }
        };
        
        global.window = {
            location: {
                href: '',
                pathname: ''
            },
            document: {
                cookie: ''
            },
            setTimeout: global.setTimeout,
            clearTimeout: global.clearTimeout,
            attachEvent: function () { }
        };

        global.NotifyScriptLoadedAndExecuteWaitingJobs = function(scriptFileName) {};
        global.Type = Function;
        this.registerNamespace("Sys");
        this.registerNamespace("SP.UI");
        this.registerNamespace("Microsoft.SharePoint.Packaging");

        global.RegisterModuleInit = function() {};
    },
    
    
    registerNamespace : function(nsString) {
        var curNs = global;
        nsString.split(".").forEach(function(nsName) {
            if (typeof curNs[nsName] == "undefined") {
                curNs[nsName] = new Object();
            }
            curNs = curNs[nsName];
            curNs.__namespace = true;
        });
        var nsName = nsString.split(".")[0];
        global.window[nsName] = global[nsName];
    },


    setDocumentProperty : function (name, value) {
        global.document[name] = value;  
    }
    
};

exports.Dependencies = Dependencies;    