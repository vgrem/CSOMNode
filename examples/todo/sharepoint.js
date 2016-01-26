var csomapi = require('csom-node'),
    settings = require('../settings.js').settings;

var webAbsoluteUrl = settings.tenantUrl + settings.webUrl;
csomapi.setLoaderOptions({ url: webAbsoluteUrl });


module.exports = {
    authenticate: function(callback) {
        var authCtx = new AuthenticationContext(webAbsoluteUrl);
        authCtx.acquireTokenForUser(settings.username, settings.password, function(err, data) {
            if (err) throw err;
            callback(null, authCtx);
        });
    },
    getListItems: function(list,qry, callback) {
        var ctx = list.get_context();
        var items = list.getItems(SP.CamlQuery.createAllItemsQuery());
        ctx.load(items);
        ctx.executeQueryAsync(function() {
                callback(null, items.get_data());
            },
            function(sender, args) {
                callback(args);
            });
    },
    addListItem: function(list, properties, callback) {
        var ctx = list.get_context();
        var creationInfo = new SP.ListItemCreationInformation();
        var listItem = list.addItem(creationInfo);
        listItem.set_item('Title', properties.title);    
        listItem.update();
        ctx.load(listItem);
        ctx.executeQueryAsync(function() {
                callback(null, listItem);
            },
            function(sender, args) {
                callback(args);
            });
    },
    updateListItem: function(list, itemId, properties, callback) {
        var ctx = list.get_context();
        var listItem = list.getItemById(itemId);
        listItem.set_item('Title', properties.title);   
        listItem.update();
        ctx.load(listItem);
        ctx.executeQueryAsync(function() {
                callback(null, listItem);
            },
            function(sender, args) {
                callback(args);
            });
    },
    deleteListItem: function(list,itemId, callback) {
        var ctx = list.get_context();
        var listItem = list.getItemById(itemId);
        listItem.deleteObject();
        ctx.executeQueryAsync(function() {
                callback(null,{});
            },
            function(sender, args) {
                callback(args);
            });
    },
    getListItem: function (list,itemId, callback) {
        var ctx = list.get_context();
        var item = list.getItemById(itemId);
        ctx.load(item);
        ctx.executeQueryAsync(function () {
            callback(null, item);
        },
            function (sender, args) {
            callback(args);
        });
    },
    webUrl: settings.tenantUrl + settings.webUrl
};


