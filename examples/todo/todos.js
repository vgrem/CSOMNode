var sharepoint = require('./sharepoint.js');

var listTitle = "Tasks";
var ctx = new SP.ClientContext(sharepoint.webUrl);
var list = ctx.get_web().get_lists().getByTitle(listTitle);

function entityToTodo(item) {
    //var todo = item.get_fieldValues();
    var todo = {};
    todo.title = item.get_item('Title');
    todo.completed = false;
    todo.id = item.get_id();
    return todo;
}

module.exports = {
    authenticate: function(authCtx) {
       authCtx.setAuthenticationCookie(ctx); //authenticate
    },

    delete: function(id, callback) {
        sharepoint.deleteListItem(list, id, function(err) {
            callback(err || null);
        });
    },

    deleteCompleted: function(callback) {
        var qry = new SP.CamlQuery();
        sharepoint.getListItems(list, qry, function(err, items) {
            if (err) {
                callback(err);
                return;
            }
            var ctx = list.get_context();
            items.forEach(function(item) {
                var listItem = list.getItemById(item.get_id());
                listItem.deleteObject();
            });

            ctx.executeQueryAsync(function() {
                    callback(null);
                },
                function(sender, args) {
                    callback(args);
                });
        });
    },

    get: function(id, callback) {
        sharepoint.getListItem(list, id, function(err, item) {
            if (err) {
                callback(err);
                return;
            }
            if (!item) {
                callback({
                    code: 404,
                    message: 'No matching list item was found.'
                });
                return;
            }
            callback(null, entityToTodo(item));
        });
    },

    getAll: function(callback) {
        sharepoint.getListItems(list, null, function(err, items) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, items.map(entityToTodo));
        });
    },

    insert: function(data, callback) {
        data.completed = false;
        sharepoint.addListItem(list, data, function(err, item) {
            if (err) {
                callback(err);
                return;
            }
            data.id = item.get_id();
            callback(null, data);
        });
    },

    update: function(id, data, callback) {
        sharepoint.updateListItem(list, id, data, function(err, item) {
            if (err) {
                callback(err);
                return;
            }
            data.id = id;
            callback(null, data);
        });
    }
};